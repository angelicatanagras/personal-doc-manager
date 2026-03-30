const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Placeholder — Epic 6 (Search & Filtering)
router.get('/', protect, (req, res) => res.json({ message: 'Search route — coming soon' }));

module.exports = router;
