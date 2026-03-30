'use strict';

const { expect } = require('chai');
const { mockRes, mockReq, mockNext, injectMock, clearMock } = require('./helpers');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_admin';

// ─── Mock models ──────────────────────────────────────────────────────────────
let userFindByIdResult = null;
let userFindResult = [];

const makeUser = (overrides = {}) => ({
  _id: 'user-id-1',
  id: 'user-id-1',
  name: 'Test User',
  email: 'user@test.com',
  role: 'user',
  status: 'active',
  toObject: function () { return { ...this }; },
  save: async function () { return this; },
  deleteOne: async function () {},
  ...overrides,
});

const UserMock = {
  findById: async () => userFindByIdResult,
  find: () => ({
    select: function () { return this; },
    sort: async () => userFindResult,
  }),
  countDocuments: async () => 0,
  aggregate: async () => [{ total: 0 }],
};

const DocMock = {
  countDocuments: async () => 0,
  aggregate: async () => [],
  deleteMany: async () => {},
};

injectMock('../models/User', UserMock);
injectMock('../models/Document', DocMock);
clearMock('../controllers/adminController');

const { getStats, getUsers, suspendUser, activateUser, deleteUser } = require('../controllers/adminController');
const { adminOnly } = require('../middleware/roleMiddleware');

// ─── roleMiddleware — adminOnly ───────────────────────────────────────────────
describe('roleMiddleware — adminOnly', () => {
  it('calls next() when user has admin role', () => {
    const req = mockReq({ user: { id: 'a1', role: 'admin' } });
    const res = mockRes();
    const next = mockNext();
    adminOnly(req, res, next);
    expect(next.called).to.be.true;
  });

  it('returns 403 when user has user role', () => {
    const req = mockReq({ user: { id: 'u1', role: 'user' } });
    const res = mockRes();
    const next = mockNext();
    adminOnly(req, res, next);
    expect(res.statusCode).to.equal(403);
    expect(next.called).to.be.false;
  });

  it('returns 403 when no user is attached to the request', () => {
    const req = mockReq({});
    const res = mockRes();
    const next = mockNext();
    adminOnly(req, res, next);
    expect(res.statusCode).to.equal(403);
  });
});

// ─── getStats ─────────────────────────────────────────────────────────────────
describe('adminController — getStats', () => {
  it('returns stat counts and total storage', async () => {
    UserMock.countDocuments = async (q) => {
      if (q?.status === 'active') return 3;
      if (q?.status === 'suspended') return 1;
      return 4;
    };
    DocMock.countDocuments = async () => 10;
    UserMock.aggregate = async () => [{ total: 5368709120 }];

    const req = mockReq({ user: { id: 'a1', role: 'admin' } });
    const res = mockRes();
    await getStats(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.include.keys('totalUsers', 'totalDocuments', 'totalStorage');
    expect(res.body.totalDocuments).to.equal(10);
  });

  it('returns 0 for storage when no users have uploads', async () => {
    UserMock.aggregate = async () => [];
    const req = mockReq({ user: { id: 'a1', role: 'admin' } });
    const res = mockRes();
    await getStats(req, res);
    expect(res.body.totalStorage).to.equal(0);
  });
});

// ─── getUsers ─────────────────────────────────────────────────────────────────
describe('adminController — getUsers', () => {
  it('returns a list of users with document counts', async () => {
    userFindResult = [makeUser(), makeUser({ _id: 'user-id-2', id: 'user-id-2', email: 'b@test.com' })];
    DocMock.aggregate = async () => [{ _id: 'user-id-1', count: 5 }];
    const req = mockReq({ user: { id: 'a1', role: 'admin' } });
    const res = mockRes();
    await getUsers(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array').with.lengthOf(2);
    expect(res.body[0].documentCount).to.equal(5);
  });

  it('returns empty array when no users exist', async () => {
    userFindResult = [];
    DocMock.aggregate = async () => [];
    const req = mockReq({ user: { id: 'a1', role: 'admin' } });
    const res = mockRes();
    await getUsers(req, res);
    expect(res.body).to.be.an('array').with.lengthOf(0);
  });
});

// ─── suspendUser ──────────────────────────────────────────────────────────────
describe('adminController — suspendUser', () => {
  it('returns 404 when user is not found', async () => {
    userFindByIdResult = null;
    const req = mockReq({ user: { id: 'a1' }, params: { id: 'ghost' } });
    const res = mockRes();
    await suspendUser(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('returns 404 when target is an admin (cannot suspend admins)', async () => {
    userFindByIdResult = makeUser({ role: 'admin' });
    const req = mockReq({ user: { id: 'a1' }, params: { id: 'admin-id' } });
    const res = mockRes();
    await suspendUser(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('sets status to suspended and returns confirmation', async () => {
    const user = makeUser();
    userFindByIdResult = user;
    const req = mockReq({ user: { id: 'a1' }, params: { id: 'user-id-1' } });
    const res = mockRes();
    await suspendUser(req, res);
    expect(res.statusCode).to.equal(200);
    expect(user.status).to.equal('suspended');
    expect(res.body.message).to.match(/suspended/i);
  });
});

// ─── activateUser ─────────────────────────────────────────────────────────────
describe('adminController — activateUser', () => {
  it('returns 404 when user is not found', async () => {
    userFindByIdResult = null;
    const req = mockReq({ user: { id: 'a1' }, params: { id: 'ghost' } });
    const res = mockRes();
    await activateUser(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('sets status to active and returns confirmation', async () => {
    const user = makeUser({ status: 'suspended' });
    userFindByIdResult = user;
    const req = mockReq({ user: { id: 'a1' }, params: { id: 'user-id-1' } });
    const res = mockRes();
    await activateUser(req, res);
    expect(res.statusCode).to.equal(200);
    expect(user.status).to.equal('active');
    expect(res.body.message).to.match(/activated/i);
  });
});

// ─── deleteUser ───────────────────────────────────────────────────────────────
describe('adminController — deleteUser', () => {
  it('returns 404 when user is not found', async () => {
    userFindByIdResult = null;
    const req = mockReq({ user: { id: 'a1' }, params: { id: 'ghost' } });
    const res = mockRes();
    await deleteUser(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('returns 404 when target is an admin (cannot delete admins)', async () => {
    userFindByIdResult = makeUser({ role: 'admin' });
    const req = mockReq({ user: { id: 'a1' }, params: { id: 'admin-id' } });
    const res = mockRes();
    await deleteUser(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('deletes user and their documents and returns confirmation', async () => {
    userFindByIdResult = makeUser();
    const req = mockReq({ user: { id: 'a1' }, params: { id: 'user-id-1' } });
    const res = mockRes();
    await deleteUser(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.match(/deleted/i);
  });
});
