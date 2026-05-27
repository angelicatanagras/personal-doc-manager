const DocumentService = require('../services/DocumentService');

class DocumentFacade {
  constructor({ documentService = new DocumentService() } = {}) {
    this.documentService = documentService;
  }

  checkNameAvailability(userId, name) {
    return this.documentService.checkNameAvailability(userId, name);
  }

  uploadDocument(payload) {
    return this.documentService.uploadDocument(payload);
  }

  listDocuments(payload) {
    return this.documentService.getDocuments(payload);
  }

  listTrashedDocuments(userId) {
    return this.documentService.getTrashedDocuments(userId);
  }

  listRecentDocuments(userId) {
    return this.documentService.getRecentDocuments(userId);
  }

  getDocument(documentId, userId) {
    return this.documentService.getDocument(documentId, userId);
  }

  updateDocument(payload) {
    return this.documentService.updateDocument(payload);
  }

  moveDocumentToTrash(documentId, userId) {
    return this.documentService.moveToTrash(documentId, userId);
  }

  restoreDocument(documentId, userId) {
    return this.documentService.restoreDocument(documentId, userId);
  }

  permanentlyDeleteDocument(documentId, userId) {
    return this.documentService.permanentlyDelete(documentId, userId);
  }

  prepareDownload(documentId, userId) {
    return this.documentService.getDownloadPayload(documentId, userId);
  }
}

module.exports = DocumentFacade;
