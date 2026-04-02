const Folder = require('../models/Folder');
const Document = require('../models/Document');

// GET /api/folders — list all folders for the current user
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id }).sort({ name: 1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch folders' });
  }
};

// POST /api/folders — create a new folder
const createFolder = async (req, res) => {
  try {
    const { name, parentId, category } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const existing = await Folder.findOne({ userId: req.user._id, name: name.trim(), parentId: parentId || null });
    if (existing) {
      return res.status(409).json({ message: 'A folder with that name already exists' });
    }

    const folder = await Folder.create({
      userId: req.user._id,
      name: name.trim(),
      parentId: parentId || null,
      category: category || 'Custom',
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create folder' });
  }
};

// PUT /api/folders/:id — rename a folder
const updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user._id });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    if (folder.isDefault) return res.status(403).json({ message: 'Cannot rename a default folder' });

    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Folder name is required' });

    folder.name = name.trim();
    await folder.save();
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update folder' });
  }
};

// DELETE /api/folders/:id — delete a folder (moves its documents to no folder)
const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user._id });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    if (folder.isDefault) return res.status(403).json({ message: 'Cannot delete a default folder' });

    // Move all documents in this folder to "no folder"
    await Document.updateMany({ folderId: folder._id }, { $set: { folderId: null } });

    await folder.deleteOne();
    res.json({ message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete folder' });
  }
};

// PUT /api/folders/:id/move-document — move a document into this folder
const moveDocument = async (req, res) => {
  try {
    const { documentId } = req.body;
    const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const folderId = req.params.id === 'none' ? null : req.params.id;

    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, userId: req.user._id });
      if (!folder) return res.status(404).json({ message: 'Folder not found' });
    }

    doc.folderId = folderId;
    await doc.save();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Failed to move document' });
  }
};

module.exports = { getFolders, createFolder, updateFolder, deleteFolder, moveDocument };
