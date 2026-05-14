const DocumentFacade = require('../facades/DocumentFacade');
const { handleControllerError } = require('./controllerUtils');

const documentFacade = new DocumentFacade();

// POST /api/documents
const uploadDocument = async (req, res) => {
  try {
    const doc = await documentFacade.uploadDocument({ userId: req.user.id, file: req.file, body: req.body });
    res.status(201).json(doc);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// GET /api/documents
const getDocuments = async (req, res) => {
  try {
    const docs = await documentFacade.listDocuments({ userId: req.user.id, query: req.query });
    res.json(docs);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// GET /api/documents/trash  — must be registered BEFORE /:id
const getTrashedDocuments = async (req, res) => {
  try {
    const docs = await documentFacade.listTrashedDocuments(req.user.id);
    res.json(docs);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// GET /api/documents/:id
const getDocument = async (req, res) => {
  try {
    const doc = await documentFacade.getDocument(req.params.id, req.user.id);
    res.json(doc);
  } catch (error) {
    handleControllerError(res, error);
  }
};

const getRecentDocuments = async (req, res) => {
  try {
    const docs = await documentFacade.listRecentDocuments(req.user.id);
    res.json(docs);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// PUT /api/documents/:id
const updateDocument = async (req, res) => {
  try {
    const updated = await documentFacade.updateDocument({
      documentId: req.params.id,
      userId: req.user.id,
      updates: req.body,
    });
    res.json(updated);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// DELETE /api/documents/:id  (soft delete → trash)
const deleteDocument = async (req, res) => {
  try {
    const response = await documentFacade.moveDocumentToTrash(req.params.id, req.user.id);
    res.json(response);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// PUT /api/documents/:id/restore
const restoreDocument = async (req, res) => {
  try {
    const response = await documentFacade.restoreDocument(req.params.id, req.user.id);
    res.json(response);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// DELETE /api/documents/:id/permanent
const permanentDelete = async (req, res) => {
  try {
    const response = await documentFacade.permanentlyDeleteDocument(req.params.id, req.user.id);
    res.json(response);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// GET /api/documents/:id/download
const downloadDocument = async (req, res) => {
  try {
    const { absolutePath, downloadName } = await documentFacade.prepareDownload(req.params.id, req.user.id);
    res.download(absolutePath, downloadName);
  } catch (error) {
    handleControllerError(res, error);
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
  getRecentDocuments,
};
