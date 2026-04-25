const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HttpError = require('../errors/HttpError');

class AuthService {
  constructor({ userModel = User, jwtSecret = process.env.JWT_SECRET } = {}) {
    this.userModel = userModel;
    this.jwtSecret = jwtSecret;
  }

  generateToken(id) {
    return jwt.sign({ id }, this.jwtSecret, { expiresIn: '30d' });
  }

  buildAuthPayload(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: this.generateToken(user.id),
    };
  }

  async registerUser({ name, email, password }) {
    const userExists = await this.userModel.findOne({ email });
    if (userExists) throw new HttpError(400, 'User already exists');

    const user = await this.userModel.create({ name, email, password });
    return this.buildAuthPayload(user);
  }

  async loginUser({ email, password }) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new HttpError(401, 'Invalid email or password');
    }

    if (user.status === 'suspended') {
      throw new HttpError(403, 'Account suspended. Contact an administrator.');
    }

    return this.buildAuthPayload(user);
  }

  async getProfile(userId) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new HttpError(404, 'User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      storageUsed: user.storageUsed,
      storageQuota: user.storageQuota,
    };
  }

  async updateProfile(userId, { name, email }) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpError(404, 'User not found');

    user.name = name || user.name;
    user.email = email || user.email;

    const updated = await user.save();
    return this.buildAuthPayload(updated);
  }
}

module.exports = AuthService;
