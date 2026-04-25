const Folder = require('../models/Folder');
const Document = require('../models/Document');
const HttpError = require('../errors/HttpError');

class FolderService {
  constructor({ folderModel = Folder, documentModel = Document } = {}) {
    this.folderModel = folderModel;
    this.documentModel = documentModel;
  }

  async getFolders(userId) {
    return this.folderModel.find({ userId }).sort({ name: 1 });
  }

  async createFolder(userId, { name, parentId, category }) {
    const trimmedName = name?.trim();
    if (!trimmedName) throw new HttpError(400, 'Folder name is required');

    const existing = await this.folderModel.findOne({
      userId,
      name: trimmedName,
      parentId: parentId || null,
    });

    if (existing) throw new HttpError(409, 'A folder with that name already exists');

    return this.folderModel.create({
      userId,
      name: trimmedName,
      parentId: parentId || null,
      category: category || 'Custom',
    });
  }

  async updateFolder(userId, folderId, { name }) {
    const folder = await this.folderModel.findOne({ _id: folderId, userId });
    if (!folder) throw new HttpError(404, 'Folder not found');
    if (folder.isDefault) throw new HttpError(403, 'Cannot rename a default folder');

    const trimmedName = name?.trim();
    if (!trimmedName) throw new HttpError(400, 'Folder name is required');

    folder.name = trimmedName;
    return folder.save();
  }

  async deleteFolder(userId, folderId) {
    const folder = await this.folderModel.findOne({ _id: folderId, userId });
    if (!folder) throw new HttpError(404, 'Folder not found');
    if (folder.isDefault) throw new HttpError(403, 'Cannot delete a default folder');

    await this.documentModel.updateMany({ folderId: folder._id }, { $set: { folderId: null } });
    await folder.deleteOne();
    return { message: 'Folder deleted' };
  }

  async moveDocument(userId, folderRouteId, documentId) {
    const document = await this.documentModel.findOne({ _id: documentId, userId });
    if (!document) throw new HttpError(404, 'Document not found');

    const folderId = folderRouteId === 'none' ? null : folderRouteId;
    if (folderId) {
      const folder = await this.folderModel.findOne({ _id: folderId, userId });
      if (!folder) throw new HttpError(404, 'Folder not found');
    }

    document.folderId = folderId;
    return document.save();
  }
}

module.exports = FolderService;
