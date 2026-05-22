'use strict';

const { expect } = require('chai');
const { mockRes, mockReq, injectMock, clearMock } = require('./helpers');

// ─── Mock Models ──────────────────────────────────────────────────────────────
const makeFolder = (overrides = {}) => ({
  _id: 'folder-id-1',
  userId: 'user-id-1',
  name: 'My Folder',
  parentId: null,
  category: 'Custom',
  isDefault: false,
  save: async function () { return this; },
  deleteOne: async function () {},
  ...overrides,
});

const makeDoc = (overrides = {}) => ({
  _id: 'doc-id-1',
  userId: 'user-id-1',
  folderId: null,
  save: async function () { return this; },
  ...overrides,
});

let folderFindOneResult = null;
let folderFindResult = [];

const FolderMock = {
  find: () => ({ sort: async () => folderFindResult }),
  findOne: async () => folderFindOneResult,
  create: async (data) => makeFolder(data),
  updateMany: async () => {},
};

let docFindOneResult = null;

const DocumentMock = {
  findOne: async () => docFindOneResult,
  updateMany: async () => {},
};

injectMock('../models/Folder', FolderMock);
injectMock('../models/Document', DocumentMock);
clearMock('../services/FolderService');
clearMock('../controllers/folderController');

const {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  moveDocument,
} = require('../controllers/folderController');

// ─── getFolders ───────────────────────────────────────────────────────────────
describe('folderController — getFolders', () => {
  it('returns an array of folders for the user', async () => {
    folderFindResult = [makeFolder(), makeFolder({ _id: 'folder-id-2', name: 'Work' })];
    const req = mockReq({ user: { _id: 'user-id-1' } });
    const res = mockRes();
    await getFolders(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array').with.lengthOf(2);
  });

  it('returns an empty array when user has no folders', async () => {
    folderFindResult = [];
    const req = mockReq({ user: { _id: 'user-id-1' } });
    const res = mockRes();
    await getFolders(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array').with.lengthOf(0);
  });
});

// ─── createFolder ─────────────────────────────────────────────────────────────
describe('folderController — createFolder', () => {
  beforeEach(() => { folderFindOneResult = null; });

  it('returns 201 and the new folder on success', async () => {
    const req = mockReq({
      user: { _id: 'user-id-1' },
      body: { name: 'Finance' },
    });
    const res = mockRes();
    await createFolder(req, res);
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('name');
  });

  it('returns 409 when a folder with the same name already exists', async () => {
    folderFindOneResult = makeFolder({ name: 'Finance' });
    const req = mockReq({
      user: { _id: 'user-id-1' },
      body: { name: 'Finance' },
    });
    const res = mockRes();
    await createFolder(req, res);
    expect(res.statusCode).to.equal(409);
    expect(res.body.message).to.match(/already exists/i);
  });

  it('returns 400 when folder name is empty', async () => {
    const req = mockReq({
      user: { _id: 'user-id-1' },
      body: { name: '   ' },
    });
    const res = mockRes();
    await createFolder(req, res);
    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.match(/folder name is required/i);
  });
});

// ─── updateFolder ─────────────────────────────────────────────────────────────
describe('folderController — updateFolder', () => {
  it('returns 404 when folder is not found', async () => {
    folderFindOneResult = null;
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'nonexistent-id' },
      body: { name: 'New Name' },
    });
    const res = mockRes();
    await updateFolder(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('returns 403 when trying to rename a default folder', async () => {
    folderFindOneResult = makeFolder({ isDefault: true });
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'folder-id-1' },
      body: { name: 'Renamed' },
    });
    const res = mockRes();
    await updateFolder(req, res);
    expect(res.statusCode).to.equal(403);
    expect(res.body.message).to.match(/cannot rename/i);
  });

  it('renames the folder and returns the updated folder', async () => {
    const folder = makeFolder();
    folderFindOneResult = folder;
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'folder-id-1' },
      body: { name: 'Renamed Folder' },
    });
    const res = mockRes();
    await updateFolder(req, res);
    expect(res.statusCode).to.equal(200);
    expect(folder.name).to.equal('Renamed Folder');
  });
});

// ─── deleteFolder ─────────────────────────────────────────────────────────────
describe('folderController — deleteFolder', () => {
  it('returns 404 when folder is not found', async () => {
    folderFindOneResult = null;
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'nonexistent-id' },
    });
    const res = mockRes();
    await deleteFolder(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('returns 403 when trying to delete a default folder', async () => {
    folderFindOneResult = makeFolder({ isDefault: true });
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'folder-id-1' },
    });
    const res = mockRes();
    await deleteFolder(req, res);
    expect(res.statusCode).to.equal(403);
    expect(res.body.message).to.match(/cannot delete/i);
  });

  it('deletes the folder and returns confirmation', async () => {
    folderFindOneResult = makeFolder();
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'folder-id-1' },
    });
    const res = mockRes();
    await deleteFolder(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.match(/deleted/i);
  });
});

// ─── moveDocument ─────────────────────────────────────────────────────────────
describe('folderController — moveDocument', () => {
  beforeEach(() => {
    folderFindOneResult = makeFolder();
    docFindOneResult = makeDoc();
  });

  it('returns 404 when document is not found', async () => {
    docFindOneResult = null;
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'folder-id-1' },
      body: { documentId: 'missing-doc' },
    });
    const res = mockRes();
    await moveDocument(req, res);
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.match(/document not found/i);
  });

  it('returns 404 when target folder is not found', async () => {
    folderFindOneResult = null;
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'missing-folder' },
      body: { documentId: 'doc-id-1' },
    });
    const res = mockRes();
    await moveDocument(req, res);
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.match(/folder not found/i);
  });

  it('moves document into the folder successfully', async () => {
    const doc = makeDoc();
    docFindOneResult = doc;
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'folder-id-1' },
      body: { documentId: 'doc-id-1' },
    });
    const res = mockRes();
    await moveDocument(req, res);
    expect(res.statusCode).to.equal(200);
    expect(doc.folderId).to.equal('folder-id-1');
  });

  it('moves document out of any folder when folder id is "none"', async () => {
    const doc = makeDoc({ folderId: 'folder-id-1' });
    docFindOneResult = doc;
    const req = mockReq({
      user: { _id: 'user-id-1' },
      params: { id: 'none' },
      body: { documentId: 'doc-id-1' },
    });
    const res = mockRes();
    await moveDocument(req, res);
    expect(res.statusCode).to.equal(200);
    expect(doc.folderId).to.be.null;
  });
});
