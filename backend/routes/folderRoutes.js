const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Placeholder — Epic 4 (Folder Organisation)
router.get('/', protect, (req, res) => res.json({ message: 'Folders route — coming soon' }));

module.exports = router;
