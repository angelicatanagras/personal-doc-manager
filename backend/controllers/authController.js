const AuthService = require('../services/AuthService');
const { handleControllerError } = require('./controllerUtils');

const authService = new AuthService();

const registerUser = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleControllerError(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body);
    res.json(user);
  } catch (error) {
    handleControllerError(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    handleControllerError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await authService.updateProfile(req.user.id, req.body);
    res.json(updatedProfile);
  } catch (error) {
    handleControllerError(res, error);
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
