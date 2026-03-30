const User = require('../models/User');
const Document = require('../models/Document');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });
    const suspendedUsers = await User.countDocuments({ role: 'user', status: 'suspended' });
    const totalDocuments = await Document.countDocuments({ deletedAt: null });
    const storageResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$storageUsed' } } },
    ]);
    const totalStorage = storageResult[0]?.total || 0;

    res.json({ totalUsers, activeUsers, suspendedUsers, totalDocuments, totalStorage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);
    const docCounts = await Document.aggregate([
      { $match: { userId: { $in: userIds }, deletedAt: null } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(docCounts.map((d) => [d._id.toString(), d.count]));

    const result = users.map((u) => ({
      ...u.toObject(),
      documentCount: countMap[u._id.toString()] || 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:id/suspend
const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    user.status = 'suspended';
    await user.save();
    res.json({ message: 'User suspended', user: { _id: user._id, status: user.status } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:id/activate
const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    user.status = 'active';
    await user.save();
    res.json({ message: 'User activated', user: { _id: user._id, status: user.status } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    await Document.deleteMany({ userId: user._id });
    await user.deleteOne();
    res.json({ message: 'User and their documents deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getUsers, suspendUser, activateUser, deleteUser };
