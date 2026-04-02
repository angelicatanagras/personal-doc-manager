const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getFolders, createFolder, updateFolder, deleteFolder, moveDocument } = require('../controllers/folderController');

router.get('/', protect, getFolders);
router.post('/', protect, createFolder);
router.put('/:id', protect, updateFolder);
router.delete('/:id', protect, deleteFolder);
router.put('/:id/move-document', protect, moveDocument);

module.exports = router;
