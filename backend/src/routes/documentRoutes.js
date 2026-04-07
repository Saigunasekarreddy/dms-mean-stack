const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  searchDocuments,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.get("/search", searchDocuments);
router.get("/:id", getDocumentById);
router.put("/:id", upload.single("file"), updateDocument);
router.delete("/:id", deleteDocument);

module.exports = router;
