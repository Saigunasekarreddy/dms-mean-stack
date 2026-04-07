const fs = require("fs");
const path = require("path");
const Document = require("../models/Document");

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch (error) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const canViewDocument = (document, user) => {
  if (user.role === "admin") return true;
  const userId = user.id;
  if (document.uploadedBy.toString() === userId) return true;
  if (document.permissions.view.some((id) => id.toString() === userId)) return true;
  if (document.permissions.edit.some((id) => id.toString() === userId)) return true;
  return false;
};

const canEditDocument = (document, user) => {
  if (user.role === "admin") return true;
  const userId = user.id;
  if (document.uploadedBy.toString() === userId) return true;
  if (document.permissions.edit.some((id) => id.toString() === userId)) return true;
  return false;
};

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const tags = parseArrayField(req.body.tags);
    const viewPermissions = parseArrayField(req.body.viewPermissions);
    const editPermissions = parseArrayField(req.body.editPermissions);

    const filePath = req.file.path.replace(/\\/g, "/");

    const document = await Document.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath,
      uploadedBy: req.user.id,
      tags,
      permissions: {
        view: viewPermissions,
        edit: editPermissions,
      },
      versions: [
        {
          versionNumber: 1,
          filePath,
          uploadedAt: new Date(),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    return next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const query = req.user.role === "admin"
      ? {}
      : {
          $or: [
            { uploadedBy: req.user.id },
            { "permissions.view": req.user.id },
            { "permissions.edit": req.user.id },
          ],
        };

    const documents = await Document.find(query)
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    return next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id).populate("uploadedBy", "name email role");
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (!canViewDocument(document, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this document",
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    return next(error);
  }
};

const searchDocuments = async (req, res, next) => {
  try {
    const { q = "", tags = "" } = req.query;
    const parsedTags = tags ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];

    const baseAccessFilter = req.user.role === "admin"
      ? {}
      : {
          $or: [
            { uploadedBy: req.user.id },
            { "permissions.view": req.user.id },
            { "permissions.edit": req.user.id },
          ],
        };

    const searchConditions = [];
    if (q) {
      searchConditions.push({
        $or: [
          { filename: { $regex: q, $options: "i" } },
          { originalName: { $regex: q, $options: "i" } },
          { tags: { $regex: q, $options: "i" } },
        ],
      });
    }

    if (parsedTags.length > 0) {
      searchConditions.push({
        tags: { $in: parsedTags },
      });
    }

    const finalQuery = searchConditions.length
      ? req.user.role === "admin"
        ? { $and: searchConditions }
        : { $and: [baseAccessFilter, ...searchConditions] }
      : baseAccessFilter;

    const documents = await Document.find(finalQuery)
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    return next(error);
  }
};

const updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (!canEditDocument(document, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit this document",
      });
    }

    const tags = parseArrayField(req.body.tags);
    const viewPermissions = parseArrayField(req.body.viewPermissions);
    const editPermissions = parseArrayField(req.body.editPermissions);

    if (tags.length) {
      document.tags = tags;
    }
    if (viewPermissions.length || req.body.viewPermissions) {
      document.permissions.view = viewPermissions;
    }
    if (editPermissions.length || req.body.editPermissions) {
      document.permissions.edit = editPermissions;
    }

    if (req.file) {
      const nextVersion = document.versions.length + 1;
      const filePath = req.file.path.replace(/\\/g, "/");

      document.filename = req.file.filename;
      document.originalName = req.file.originalname;
      document.filePath = filePath;
      document.versions.push({
        versionNumber: nextVersion,
        filePath,
        uploadedAt: new Date(),
      });
    }

    await document.save();

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (!canEditDocument(document, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this document",
      });
    }

    const allPaths = new Set(document.versions.map((version) => version.filePath));
    allPaths.add(document.filePath);

    for (const filePath of allPaths) {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    await document.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  searchDocuments,
  updateDocument,
  deleteDocument,
  canViewDocument,
};
