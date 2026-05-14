const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true }, // e.g. 'pdf', 'jpg', 'docx'
    mimeType: { type: String, required: true },
    size: { type: Number, required: true }, // bytes
    filePath: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ['valid', 'expiring', 'expired', 'stored'],
      default: 'stored',
    },
    expiryDate: { type: Date, default: null },
    currentVersion: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null }, // soft delete

    lastViewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Document', documentSchema);
