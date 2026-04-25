const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { getStats, getUsers, createUser, updateUser, suspendUser, activateUser, deleteUser } = require('../controllers/adminController');
const { validateAdminUserPayload } = require('../middleware/validationMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/users', validateAdminUserPayload, createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/activate', activateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
