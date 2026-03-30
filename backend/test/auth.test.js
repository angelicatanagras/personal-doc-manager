'use strict';

const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const { mockRes, mockReq, mockNext, injectMock, clearMock, mockQuery } = require('./helpers');

const JWT_SECRET = 'test_secret_auth';
process.env.JWT_SECRET = JWT_SECRET;

// ─── Mock User model ────────────────────────────────────────────────────────
let userFindOneResult = null;
let userCreateResult = null;
let userFindByIdResult = null;

const UserMock = {
  findOne: async () => userFindOneResult,
  create: async (data) => userCreateResult || { ...data, id: 'new-id-123', _id: 'new-id-123', role: 'user' },
  findById: async () => ({
    ...userFindByIdResult,
    select: function () { return this; },
  }),
  findByIdAndUpdate: async () => {},
};

injectMock('../models/User', UserMock);
clearMock('../controllers/authController');
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController');

// ─── JWT ─────────────────────────────────────────────────────────────────────
describe('Auth — JWT', () => {
  const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

  it('generates a valid JWT containing the user id', () => {
    const token = generateToken('user123');
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.id).to.equal('user123');
  });

  it('includes an exp claim in the payload', () => {
    const decoded = jwt.verify(generateToken('user123'), JWT_SECRET);
    expect(decoded).to.have.property('exp');
  });

  it('rejects a token signed with the wrong secret', () => {
    const token = generateToken('user123');
    expect(() => jwt.verify(token, 'wrong_secret')).to.throw();
  });

  it('rejects a malformed token string', () => {
    expect(() => jwt.verify('not.a.token', JWT_SECRET)).to.throw();
  });
});

// ─── Auth middleware logic ───────────────────────────────────────────────────
describe('Auth — middleware logic', () => {
  const verifyBearer = (header) => {
    if (!header || !header.startsWith('Bearer ')) return null;
    return jwt.verify(header.split(' ')[1], JWT_SECRET);
  };

  it('returns null when Authorization header is missing', () => {
    expect(verifyBearer(undefined)).to.be.null;
  });

  it('returns null when header does not start with "Bearer "', () => {
    expect(verifyBearer('Token abc')).to.be.null;
  });

  it('decodes a valid Bearer token', () => {
    const token = jwt.sign({ id: 'user789' }, JWT_SECRET, { expiresIn: '30d' });
    const decoded = verifyBearer(`Bearer ${token}`);
    expect(decoded.id).to.equal('user789');
  });

  it('throws when the Bearer token is expired', () => {
    const token = jwt.sign({ id: 'u1' }, JWT_SECRET, { expiresIn: '-1s' });
    expect(() => verifyBearer(`Bearer ${token}`)).to.throw();
  });
});

// ─── registerUser ────────────────────────────────────────────────────────────
describe('authController — registerUser', () => {
  it('returns 400 when email already exists', async () => {
    userFindOneResult = { id: 'existing', email: 'dup@test.com' };
    const req = mockReq({ body: { name: 'Jane', email: 'dup@test.com', password: 'pass' } });
    const res = mockRes();
    await registerUser(req, res);
    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.match(/already exists/i);
  });

  it('returns 201 and a token on successful registration', async () => {
    userFindOneResult = null;
    userCreateResult = { id: 'new-id', name: 'Jane', email: 'jane@test.com', role: 'user' };
    const req = mockReq({ body: { name: 'Jane', email: 'jane@test.com', password: 'secure123' } });
    const res = mockRes();
    await registerUser(req, res);
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('token');
    expect(res.body.email).to.equal('jane@test.com');
  });
});

// ─── loginUser ───────────────────────────────────────────────────────────────
describe('authController — loginUser', () => {
  it('returns 401 when user is not found', async () => {
    userFindOneResult = null;
    const req = mockReq({ body: { email: 'ghost@test.com', password: 'any' } });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.statusCode).to.equal(401);
    expect(res.body.message).to.match(/invalid/i);
  });

  it('returns 401 when password does not match', async () => {
    userFindOneResult = { id: 'u1', email: 'u@test.com', status: 'active', matchPassword: async () => false };
    const req = mockReq({ body: { email: 'u@test.com', password: 'wrong' } });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.statusCode).to.equal(401);
  });

  it('returns 403 when account is suspended', async () => {
    userFindOneResult = { id: 'u2', email: 'u@test.com', status: 'suspended', matchPassword: async () => true };
    const req = mockReq({ body: { email: 'u@test.com', password: 'correct' } });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.statusCode).to.equal(403);
    expect(res.body.message).to.match(/suspended/i);
  });

  it('returns 200 and a token on successful login', async () => {
    userFindOneResult = {
      id: 'u3', name: 'Test', email: 'test@test.com', role: 'user', status: 'active',
      matchPassword: async () => true,
    };
    const req = mockReq({ body: { email: 'test@test.com', password: 'correct' } });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token');
  });
});

// ─── getProfile ──────────────────────────────────────────────────────────────
describe('authController — getProfile', () => {
  it('returns 404 when user does not exist', async () => {
    // findById().select() — return a chainable thenable resolving to null
    UserMock.findById = () => mockQuery(null);
    const req = mockReq({ user: { id: 'ghost' } });
    const res = mockRes();
    await getProfile(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('returns the user profile on success', async () => {
    const profile = { id: 'u1', name: 'Alice', email: 'a@test.com', role: 'user', storageUsed: 0, storageQuota: 5368709120 };
    UserMock.findById = () => mockQuery(profile);
    const req = mockReq({ user: { id: 'u1' } });
    const res = mockRes();
    await getProfile(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body.email).to.equal('a@test.com');
  });
});

// ─── updateProfile ───────────────────────────────────────────────────────────
describe('authController — updateProfile', () => {
  it('returns 404 when user does not exist', async () => {
    UserMock.findById = async () => null;
    const req = mockReq({ user: { id: 'ghost' }, body: { name: 'New Name' } });
    const res = mockRes();
    await updateProfile(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it('updates name and returns a new token on success', async () => {
    const fakeUser = {
      id: 'u1', name: 'Old', email: 'a@test.com', role: 'user',
      save: async function () { return this; },
    };
    UserMock.findById = async () => fakeUser;
    const req = mockReq({ user: { id: 'u1' }, body: { name: 'New Name' } });
    const res = mockRes();
    await updateProfile(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token');
  });
});
