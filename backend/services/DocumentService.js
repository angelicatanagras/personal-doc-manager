const Document = require('../models/Document');
const User = require('../models/User');
require('../models/Folder');
const HttpError = require('../errors/HttpError');
const LocalStorageAdapter = require('../adapters/storage/LocalStorageAdapter');
const DocumentStrategyFactory = require('../factories/documentStrategyFactory');
const appEventBus = require('../events/appEventBus');

class DocumentService {
  constructor({
    documentModel = Document,
    userModel = User,
    storageAdapter = new LocalStorageAdapter(),
    strategyFactory = new DocumentStrategyFactory(),
    eventBus = appEventBus,
  } = {}) {
    this.documentModel = documentModel;
    this.userModel = userModel;
    this.storageAdapter = storageAdapter;
    this.strategyFactory = strategyFactory;
    this.eventBus = eventBus;
  }

  computeStatus(expiryDate) {
    if (!expiryDate) return 'stored';
    const now = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < now) return 'expired';
    const daysUntil = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 30) return 'expiring';
    return 'valid';
  }

  getFileType(mimetype, originalName) {
    const map = {
      'application/pdf': 'pdf',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'text/plain': 'txt',
    };
    return map[mimetype] || require('path').extname(originalName).replace('.', '').toLowerCase() || 'file';
  }

  parseTags(tags) {
    if (!tags) return [];
    return typeof tags === 'string' ? JSON.parse(tags) : tags;
  }

  async findOwnedDocument(documentId, userId) {
    const document = await this.documentModel.findOne({ _id: documentId, userId });
    if (!document) throw new HttpError(404, 'Document not found');
    return document;
  }

  async uploadDocument({ userId, file, body }) {
    if (!file) throw new HttpError(400, 'No file uploaded');

    const existing = await this.documentModel.findOne({
      userId,
      originalName: file.originalname,
      deletedAt: null,
    });

    if (existing) {
      this.storageAdapter.remove(file.path);
      throw new HttpError(409, `A document named "${file.originalname}" already exists. Rename the file or delete the existing one first.`);
    }

    const document = await this.documentModel.create({
      userId,
      name: body.name || file.originalname,
      originalName: file.originalname,
      fileType: this.getFileType(file.mimetype, file.originalname),
      mimeType: file.mimetype,
      size: file.size,
      filePath: file.path,
      folderId: body.folderId || null,
      tags: this.parseTags(body.tags),
      expiryDate: body.expiryDate || null,
      status: this.computeStatus(body.expiryDate),
    });

    await this.userModel.findByIdAndUpdate(userId, { $inc: { storageUsed: file.size } });
    this.eventBus.emit('document:uploaded', { document, userId });
    return document;
  }

  async getDocuments({ userId, query }) {
    const { search, fileType, sort, folderId } = query;
    const dbQuery = { userId, deletedAt: null };

    if (search) dbQuery.name = { $regex: search, $options: 'i' };
    if (fileType) dbQuery.fileType = fileType;
    if (folderId) dbQuery.folderId = folderId;

    let sortBy = { createdAt: -1 };
    if (sort === 'name') sortBy = { name: 1 };
    if (sort === 'size') sortBy = { size: -1 };
    if (sort === 'expiry') sortBy = { expiryDate: 1 };

    const documents = await this.documentModel.find(dbQuery).populate('folderId', 'name').sort(sortBy);
    return documents.map((document) => ({
      ...document.toObject(),
      status: this.computeStatus(document.expiryDate),
    }));
  }

  async getRecentDocuments(userId) {
    const documents = await this.documentModel
      .find({
        userId,
        deletedAt: null,
        lastViewedAt: { $ne: null }
      })
      .sort({ lastViewedAt: -1 })
      .limit(10)
      .populate('folderId', 'name');

    return documents.map((document) => ({
      ...document.toObject(),
      status: this.computeStatus(document.expiryDate),
    }));
  }

  async getTrashedDocuments(userId) {
    return this.documentModel
      .find({ userId, deletedAt: { $ne: null } })
      .populate('folderId', 'name')
      .sort({ deletedAt: -1 });
  }

  async getDocument(documentId, userId) {

    const document = await this.documentModel
      .findOneAndUpdate(
        { _id: documentId, userId },
        { $set: { lastViewedAt: new Date() } },
        { new: true }
      )
      .populate('folderId', 'name')
      .populate('tags', 'name color');

    if (!document) throw new HttpError(404, 'Document not found');
    const strategy = this.strategyFactory.create(document);

    return {
      ...document.toObject(),
      preview: {
        supported: strategy.supportsInlinePreview(),
        type: strategy.getPreviewType(),
      },
    };
  }

  async updateDocument({ documentId, userId, updates }) {
    const document = await this.findOwnedDocument(documentId, userId);
    const { name, folderId, tags, expiryDate } = updates;

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) throw new HttpError(400, 'Document name is required');
      document.name = trimmedName;
    }

    if (folderId !== undefined) document.folderId = folderId || null;
    if (tags !== undefined) document.tags = tags;

    if (expiryDate !== undefined) {
      document.expiryDate = expiryDate || null;
      document.status = this.computeStatus(expiryDate);
    }

    return document.save();
  }

  async moveToTrash(documentId, userId) {
    const document = await this.findOwnedDocument(documentId, userId);
    document.deletedAt = new Date();
    await document.save();
    this.eventBus.emit('document:deleted', { documentId: document.id, userId, action: 'trashed' });
    return { message: 'Document moved to trash' };
  }

  async restoreDocument(documentId, userId) {
    const document = await this.findOwnedDocument(documentId, userId);
    document.deletedAt = null;
    await document.save();
    this.eventBus.emit('document:deleted', { documentId: document.id, userId, action: 'restored' });
    return { message: 'Document restored', doc: document };
  }

  async permanentlyDelete(documentId, userId) {
    const document = await this.findOwnedDocument(documentId, userId);
    this.storageAdapter.remove(document.filePath);
    await this.userModel.findByIdAndUpdate(userId, { $inc: { storageUsed: -document.size } });
    await document.deleteOne();
    this.eventBus.emit('document:deleted', { documentId: document.id, userId, action: 'permanentlyDeleted' });
    return { message: 'Document permanently deleted' };
  }

  async getDownloadPayload(documentId, userId) {
    const document = await this.findOwnedDocument(documentId, userId);
    const absolutePath = this.storageAdapter.resolve(document.filePath);
    const strategy = this.strategyFactory.create(document);
    const extension = this.storageAdapter.extensionFor(document.originalName);

    if (!this.storageAdapter.exists(absolutePath)) {
      throw new HttpError(404, 'File not found on disk');
    }

    return {
      absolutePath,
      downloadName: strategy.buildDownloadName(document, extension),
    };
  }
}

module.exports = DocumentService;
