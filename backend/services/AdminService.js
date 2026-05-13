const bcrypt = require('bcrypt');
const User = require('../models/User');
const Document = require('../models/Document');
const HttpError = require('../errors/HttpError');
const appEventBus = require('../events/appEventBus');

class AdminService {
  constructor({ userModel = User, documentModel = Document, eventBus = appEventBus } = {}) {
    this.userModel = userModel;
    this.documentModel = documentModel;
    this.eventBus = eventBus;
  }

  sanitizeUser(user) {
    const { password: _password, ...userData } = user.toObject();
    return userData;
  }

  async getStats() {
    const totalUsers = await this.userModel.countDocuments({ role: 'user' });
    const activeUsers = await this.userModel.countDocuments({ role: 'user', status: 'active' });
    const suspendedUsers = await this.userModel.countDocuments({ role: 'user', status: 'suspended' });
    const totalDocuments = await this.documentModel.countDocuments({ deletedAt: null });
    const storageResult = await this.documentModel.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalDocuments,
      totalStorage: storageResult[0]?.total || 0,
    };
  }

  async getUsers() {
    const users = await this.userModel.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    const userIds = users.map((user) => user._id);
    const docCounts = await this.documentModel.aggregate([
      { $match: { userId: { $in: userIds }, deletedAt: null } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(docCounts.map((doc) => [doc._id.toString(), doc.count]));

    return users.map((user) => ({
      ...user.toObject(),
      documentCount: countMap[user._id.toString()] || 0,
    }));
  }

  async createUser({ name, email, password, role }) {
    if (!name || !email || !password) {
      throw new HttpError(400, 'Name, email and password are required');
    }

    if (password.length < 6) {
      throw new HttpError(400, 'Password must be minimum 6 characters');
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await this.userModel.findOne({ email: normalizedEmail });
    if (existing) throw new HttpError(409, 'Email already in use');

    const user = await this.userModel.create({
      name,
      email: normalizedEmail,
      password: password,
      role: role === 'admin' ? 'admin' : 'user',
      status: 'active',
    });

    return this.sanitizeUser(user);
  }

  async updateUser(userId, { name, email, role }) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpError(404, 'User not found');

    if (name) user.name = name;

    if (email) {
      const normalizedEmail = email.toLowerCase();
      const conflict = await this.userModel.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (conflict) throw new HttpError(409, 'Email already in use');
      user.email = normalizedEmail;
    }

    if (role && ['user', 'admin'].includes(role)) user.role = role;

    await user.save();
    return this.sanitizeUser(user);
  }

  async updateUserStatus(userId, status) {
    const user = await this.userModel.findById(userId);
    if (!user || user.role === 'admin') throw new HttpError(404, 'User not found');

    user.status = status;
    await user.save();
    this.eventBus.emit('user:statusChanged', { userId: user.id, status });
    return {
      message: status === 'suspended' ? 'User suspended' : 'User activated',
      user: { _id: user._id, status: user.status },
    };
  }

  async deleteUser(userId) {
    const user = await this.userModel.findById(userId);
    if (!user || user.role === 'admin') throw new HttpError(404, 'User not found');

    await this.documentModel.deleteMany({ userId: user._id });
    await user.deleteOne();
    return { message: 'User and their documents deleted' };
  }
}

module.exports = AdminService;
