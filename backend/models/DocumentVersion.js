const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    versionNumber: { type: Number, required: true },
    filePath: { type: String, required: true },
    size: { type: Number, required: true }, // bytes
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DocumentVersion', documentVersionSchema);
