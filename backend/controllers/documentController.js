const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const User = require('../models/User');
require('../models/Folder'); // register Folder schema for populate

const computeStatus = (expiryDate) => {
  if (!expiryDate) return 'stored';
  const now = new Date();
  const expiry = new Date(expiryDate);
  if (expiry < now) return 'expired';
  const daysUntil = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 30) return 'expiring';
  return 'valid';
};

const getFileType = (mimetype, originalname) => {
  const map = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
  };
  return map[mimetype] || path.extname(originalname).replace('.', '').toLowerCase() || 'file';
};

const getDownloadName = (doc) => {
  const trimmedName = (doc.name || '').trim();
  const originalName = doc.originalName || '';
  const extension = path.extname(originalName);

  if (!trimmedName) return originalName || 'document';
  if (extension && trimmedName.toLowerCase().endsWith(extension.toLowerCase())) return trimmedName;
  return `${trimmedName}${extension}`;
};

// POST /api/documents
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const existing = await Document.findOne({
      userId: req.user.id,
      originalName: req.file.originalname,
      deletedAt: null,
    });
    if (existing) {
      fs.unlinkSync(req.file.path); // remove the just-uploaded temp file
      return res.status(409).json({
        message: `A document named "${req.file.originalname}" already exists. Rename the file or delete the existing one first.`,
      });
    }

    const { name, folderId, tags, expiryDate } = req.body;
    const fileType = getFileType(req.file.mimetype, req.file.originalname);
    const status = computeStatus(expiryDate);

    const doc = await Document.create({
      userId: req.user.id,
      name: name || req.file.originalname,
      originalName: req.file.originalname,
      fileType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      filePath: req.file.path,
      folderId: folderId || null,
      tags: tags ? JSON.parse(tags) : [],
      expiryDate: expiryDate || null,
      status,
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { storageUsed: req.file.size } });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/documents
const getDocuments = async (req, res) => {
  try {
    const { search, fileType, sort, folderId } = req.query;
    const query = { userId: req.user.id, deletedAt: null };

    if (search) query.name = { $regex: search, $options: 'i' };
    if (fileType) query.fileType = fileType;
    if (folderId) query.folderId = folderId;

    let sortObj = { createdAt: -1 };
    if (sort === 'name') sortObj = { name: 1 };
    if (sort === 'size') sortObj = { size: -1 };
    if (sort === 'expiry') sortObj = { expiryDate: 1 };

    const docs = await Document.find(query)
      .populate('folderId', 'name')
      .sort(sortObj);

    const updated = docs.map((d) => ({
      ...d.toObject(),
      status: computeStatus(d.expiryDate),
    }));

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/documents/trash  — must be registered BEFORE /:id
const getTrashedDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id, deletedAt: { $ne: null } })
      .populate('folderId', 'name')
      .sort({ deletedAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/documents/:id
const getDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('folderId', 'name')
      .populate('tags', 'name color');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/documents/:id
const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const { name, folderId, tags, expiryDate } = req.body;
    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) return res.status(400).json({ message: 'Document name is required' });
      doc.name = trimmedName;
    }
    if (folderId !== undefined) doc.folderId = folderId || null;
    if (tags !== undefined) doc.tags = tags;
    if (expiryDate !== undefined) {
      doc.expiryDate = expiryDate || null;
      doc.status = computeStatus(expiryDate);
    }

    const updated = await doc.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/documents/:id  (soft delete → trash)
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    doc.deletedAt = new Date();
    await doc.save();
    res.json({ message: 'Document moved to trash' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/documents/:id/restore
const restoreDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    doc.deletedAt = null;
    await doc.save();
    res.json({ message: 'Document restored', doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/documents/:id/permanent
const permanentDelete = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (fs.existsSync(doc.filePath)) fs.unlinkSync(doc.filePath);
    await User.findByIdAndUpdate(req.user.id, { $inc: { storageUsed: -doc.size } });
    await doc.deleteOne();

    res.json({ message: 'Document permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/documents/:id/download
const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const absPath = path.resolve(doc.filePath);
    if (!fs.existsSync(absPath)) return res.status(404).json({ message: 'File not found on disk' });

    res.download(absPath, getDownloadName(doc));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getTrashedDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
  permanentDelete,
  downloadDocument,
};
