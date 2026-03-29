const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
    isDefault: { type: Boolean, default: false }, // true for seeded categories
    category: {
      type: String,
      enum: ['Identity', 'Financial', 'Medical', 'Legal', 'Property', 'Custom'],
      default: 'Custom',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Folder', folderSchema);
