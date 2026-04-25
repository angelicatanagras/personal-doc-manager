const AdminService = require('../services/AdminService');
const { handleControllerError } = require('./controllerUtils');

const adminService = new AdminService();

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();
    res.json(users);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// POST /api/admin/users — create a new user
const createUser = async (req, res) => {
  try {
    const userData = await adminService.createUser(req.body);
    res.status(201).json(userData);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// PUT /api/admin/users/:id — update name, email, role
const updateUser = async (req, res) => {
  try {
    const userData = await adminService.updateUser(req.params.id, req.body);
    res.json(userData);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// PUT /api/admin/users/:id/suspend
const suspendUser = async (req, res) => {
  try {
    const response = await adminService.updateUserStatus(req.params.id, 'suspended');
    res.json(response);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// PUT /api/admin/users/:id/activate
const activateUser = async (req, res) => {
  try {
    const response = await adminService.updateUserStatus(req.params.id, 'active');
    res.json(response);
  } catch (error) {
    handleControllerError(res, error);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const response = await adminService.deleteUser(req.params.id);
    res.json(response);
  } catch (error) {
    handleControllerError(res, error);
  }
};

module.exports = { getStats, getUsers, createUser, updateUser, suspendUser, activateUser, deleteUser };
