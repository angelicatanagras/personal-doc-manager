const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegisterPayload, validateLoginPayload, validateProfileUpdatePayload } = require('../middleware/validationMiddleware');

router.post('/register', validateRegisterPayload, registerUser);
router.post('/login', validateLoginPayload, loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateProfileUpdatePayload, updateProfile);

module.exports = router;
