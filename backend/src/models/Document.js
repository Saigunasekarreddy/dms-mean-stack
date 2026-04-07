const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    permissions: {
      view: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      edit: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    versions: [
      {
        versionNumber: {
          type: Number,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

documentSchema.index({ filename: "text", tags: "text" });

module.exports = mongoose.model("Document", documentSchema);
