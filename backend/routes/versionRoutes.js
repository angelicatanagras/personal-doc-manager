const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Placeholder — Epic 5 (Version History)
router.get('/', protect, (req, res) => res.json({ message: 'Versions route — coming soon' }));

module.exports = router;
