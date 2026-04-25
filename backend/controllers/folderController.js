const FolderService = require('../services/FolderService');
const { handleControllerError } = require('./controllerUtils');

const folderService = new FolderService();

// GET /api/folders — list all folders for the current user
const getFolders = async (req, res) => {
  try {
    const folders = await folderService.getFolders(req.user._id);
    res.json(folders);
  } catch (error) {
    handleControllerError(res, error, 'Failed to fetch folders');
  }
};

// POST /api/folders — create a new folder
const createFolder = async (req, res) => {
  try {
    const folder = await folderService.createFolder(req.user._id, req.body);
    res.status(201).json(folder);
  } catch (error) {
    handleControllerError(res, error, 'Failed to create folder');
  }
};

// PUT /api/folders/:id — rename a folder
const updateFolder = async (req, res) => {
  try {
    const folder = await folderService.updateFolder(req.user._id, req.params.id, req.body);
    res.json(folder);
  } catch (error) {
    handleControllerError(res, error, 'Failed to update folder');
  }
};

// DELETE /api/folders/:id — delete a folder (moves its documents to no folder)
const deleteFolder = async (req, res) => {
  try {
    const response = await folderService.deleteFolder(req.user._id, req.params.id);
    res.json(response);
  } catch (error) {
    handleControllerError(res, error, 'Failed to delete folder');
  }
};

// PUT /api/folders/:id/move-document — move a document into this folder
const moveDocument = async (req, res) => {
  try {
    const doc = await folderService.moveDocument(req.user._id, req.params.id, req.body.documentId);
    res.json(doc);
  } catch (error) {
    handleControllerError(res, error, 'Failed to move document');
  }
};

module.exports = { getFolders, createFolder, updateFolder, deleteFolder, moveDocument };
