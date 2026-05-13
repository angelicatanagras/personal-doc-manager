'use strict';

const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { mockRes, mockReq, injectMock, clearMock, mockQuery } = require('./helpers');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_doc';

// ─── computeStatus (replicated from documentController) ──────────────────────
const computeStatus = (expiryDate) => {
  if (!expiryDate) return 'stored';
  const now = new Date();
  const expiry = new Date(expiryDate);
  if (expiry < now) return 'expired';
  const daysUntil = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 30) return 'expiring';
  return 'valid';
};

// ─── getFileType (replicated from documentController) ────────────────────────
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

// ─── Mock models ──────────────────────────────────────────────────────────────
let docFindOneResult = null;
let docFindResult = [];

const makeDoc = (overrides = {}) => ({
  _id: 'doc-id-1',
  id: 'doc-id-1',
  userId: 'user-id-1',
  name: 'test.pdf',
  originalName: 'test.pdf',
  fileType: 'pdf',
  mimeType: 'application/pdf',
  size: 1024,
  filePath: '/tmp/test.pdf',
  folderId: null,
  tags: [],
  expiryDate: null,
  status: 'stored',
  deletedAt: null,
  toObject: function () { return { ...this }; },
  save: async function () { return this; },
  deleteOne: async function () {},
  populate: function () { return this; },
  ...overrides,
});

const DocMock = {
  findOne: async () => docFindOneResult,
  findOneAndUpdate: () => DocMock.findOne(),
  find: () => ({
    populate: function () { return this; },
    sort: async () => docFindResult.map((d) => ({ ...d, toObject: () => d })),
  }),
  create: async (data) => makeDoc(data),
};

const UserMock = {
  findByIdAndUpdate: async () => {},
};

// Register Folder mock (required inside documentController)
injectMock('../models/Folder', {});
injectMock('../models/User', UserMock);
injectMock('../models/Document', DocMock);
clearMock('../controllers/documentController');

const {
  uploadDocument,
  getDocuments,
  getTrashedDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
  permanentDelete,
} = require('../controllers/documentController');

// ─── computeStatus ────────────────────────────────────────────────────────────
describe('Document — computeStatus', () => {
  it('returns "stored" when no expiry date is set', () => {
    expect(computeStatus(null)).to.equal('stored');
    expect(computeStatus(undefined)).to.equal('stored');
  });

  it('returns "expired" for a past date', () => {
    const past = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    expect(computeStatus(past)).to.equal('expired');
  });

  it('returns "expiring" when expiry is within 30 days', () => {
    const soon = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
    expect(computeStatus(soon)).to.equal('expiring');
  });

  it('returns "valid" when expiry is more than 30 days away', () => {
    const future = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days from now
    expect(computeStatus(future)).to.equal('valid');
  });
});

// ─── getFileType ──────────────────────────────────────────────────────────────
describe('Document — getFileType', () => {
  it('maps application/pdf → pdf', () => expect(getFileType('application/pdf', 'f.pdf')).to.equal('pdf'));
  it('maps image/jpeg → jpg', () => expect(getFileType('image/jpeg', 'f.jpg')).to.equal('jpg'));
  it('maps image/png → png', () => expect(getFileType('image/png', 'f.png')).to.equal('png'));
  it('maps docx MIME → docx', () => {
    expect(getFileType('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'f.docx')).to.equal('docx');
  });
  it('maps xlsx MIME → xlsx', () => {
    expect(getFileType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'f.xlsx')).to.equal('xlsx');
  });
  it('falls back to file extension for unknown MIME types', () => {
    expect(getFileType('application/unknown', 'file.csv')).to.equal('csv');
  });
});

// ─── uploadDocument ───────────────────────────────────────────────────────────
describe('documentController — uploadDocument', () => {
  // Reset findOne before each test in this block
  beforeEach(() => { DocMock.findOne = async () => null; });

  it('returns 400 when no file is attached', async () => {
    const req = mockReq({ user: { id: 'u1' } });
    const res = mockRes();
    await uploadDocument(req, res);
    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.match(/no file/i);
  });

  it('returns 409 when a duplicate filename exists', async () => {
    // Create a real temp file so fs.unlinkSync inside the controller succeeds
    const tmpFile = path.join(os.tmpdir(), `clouddoc-test-${Date.now()}.pdf`);
    fs.writeFileSync(tmpFile, 'dummy');

    DocMock.findOne = async () => makeDoc({ originalName: 'dup.pdf' });
    const req = mockReq({
      user: { id: 'u1' },
      file: { originalname: 'dup.pdf', mimetype: 'application/pdf', size: 1024, path: tmpFile },
    });
    const res = mockRes();
    await uploadDocument(req, res);
    expect(res.statusCode).to.equal(409);
    expect(res.body.message).to.match(/already exists/i);
  });

  it('returns 201 and the document on successful upload', async () => {
    const req = mockReq({
      user: { id: 'u1' },
      file: { originalname: 'new.pdf', mimetype: 'application/pdf', size: 2048, path: '/tmp/new.pdf' },
      body: { name: 'My Doc', tags: '[]' },
    });
    const res = mockRes();
    await uploadDocument(req, res);
    expect(res.statusCode).to.equal(201);
  });
});

// ─── getDocuments ─────────────────────────────────────────────────────────────
describe('documentController — getDocuments', () => {
  it('returns an array of active documents', async () => {
    docFindResult = [makeDoc(), makeDoc({ id: 'doc-2', name: 'report.pdf' })];
    const req = mockReq({ user: { id: 'u1' }, query: {} });
    const res = mockRes();
    await getDocuments(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array').with.lengthOf(2);
  });

  it('returns an empty array when no documents exist', async () => {
    docFindResult = [];
    const req = mockReq({ user: { id: 'u1' }, query: {} });
    const res = mockRes();
    await getDocuments(req, res);
    expect(res.body).to.be.an('array').with.lengthOf(0);
  });
});

// ─── getTrashedDocuments ──────────────────────────────────────────────────────
describe('documentController — getTrashedDocuments', () => {
  it('returns trashed documents', async () => {
    docFindResult = [makeDoc({ deletedAt: new Date() })];
    const req = mockReq({ user: { id: 'u1' } });
    const res = mockRes();
    await getTrashedDocuments(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});

// ─── getDocument ──────────────────────────────────────────────────────────────
describe('documentController — getDocument', () => {
  it('returns 404 when document is not found', async () => {
    // findOne().populate().populate() — chainable thenable resolving to null
    DocMock.findOne = () => mockQuery(null);
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'missing-id' } });
    const res = mockRes();
    await getDocument(req, res);
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.match(/not found/i);
  });

  it('returns the document when found', async () => {
    DocMock.findOne = () => mockQuery(makeDoc());
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'doc-id-1' } });
    const res = mockRes();
    await getDocument(req, res);
    expect(res.statusCode).to.equal(200);
  });
});

// ─── updateDocument ───────────────────────────────────────────────────────────
describe('documentController — updateDocument', () => {
  beforeEach(() => { DocMock.findOne = async () => null; });

  it('returns 404 when document does not belong to user', async () => {
    DocMock.findOne = async () => null;
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'x' }, body: { name: 'New' } });
    const res = mockRes();
    await updateDocument(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('updates allowed fields and returns the updated document', async () => {
    const doc = makeDoc();
    DocMock.findOne = async () => doc;
    const req = mockReq({
      user: { id: 'u1' }, params: { id: 'doc-id-1' },
      body: { name: 'Renamed', tags: ['finance'] },
    });
    const res = mockRes();
    await updateDocument(req, res);
    expect(res.statusCode).to.equal(200);
    expect(doc.name).to.equal('Renamed');
  });

  it('rejects blank document names when renaming', async () => {
    const doc = makeDoc();
    DocMock.findOne = async () => doc;
    const req = mockReq({
      user: { id: 'u1' }, params: { id: 'doc-id-1' },
      body: { name: '   ' },
    });
    const res = mockRes();
    await updateDocument(req, res);
    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.match(/document name is required/i);
  });
});

// ─── deleteDocument (soft) ────────────────────────────────────────────────────
describe('documentController — deleteDocument (soft)', () => {
  it('returns 404 when document is not found', async () => {
    DocMock.findOne = async () => null;
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'x' } });
    const res = mockRes();
    await deleteDocument(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('sets deletedAt and confirms trash move', async () => {
    const doc = makeDoc();
    DocMock.findOne = async () => doc;
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'doc-id-1' } });
    const res = mockRes();
    await deleteDocument(req, res);
    expect(res.statusCode).to.equal(200);
    expect(doc.deletedAt).to.be.an.instanceOf(Date);
    expect(res.body.message).to.match(/trash/i);
  });
});

// ─── restoreDocument ──────────────────────────────────────────────────────────
describe('documentController — restoreDocument', () => {
  it('returns 404 when document is not found', async () => {
    DocMock.findOne = async () => null;
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'x' } });
    const res = mockRes();
    await restoreDocument(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('clears deletedAt and confirms restore', async () => {
    const doc = makeDoc({ deletedAt: new Date() });
    DocMock.findOne = async () => doc;
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'doc-id-1' } });
    const res = mockRes();
    await restoreDocument(req, res);
    expect(res.statusCode).to.equal(200);
    expect(doc.deletedAt).to.be.null;
    expect(res.body.message).to.match(/restored/i);
  });
});

// ─── permanentDelete ──────────────────────────────────────────────────────────
describe('documentController — permanentDelete', () => {
  it('returns 404 when document is not found', async () => {
    DocMock.findOne = async () => null;
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'x' } });
    const res = mockRes();
    await permanentDelete(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('deletes the document record and confirms deletion', async () => {
    const doc = makeDoc({ filePath: '/nonexistent/path.pdf' });
    DocMock.findOne = async () => doc;
    const req = mockReq({ user: { id: 'u1' }, params: { id: 'doc-id-1' } });
    const res = mockRes();
    await permanentDelete(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.match(/permanently deleted/i);
  });
});
