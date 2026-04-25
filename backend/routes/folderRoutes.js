const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getFolders, createFolder, updateFolder, deleteFolder, moveDocument } = require('../controllers/folderController');
const { validateFolderPayload, validateMoveDocumentPayload } = require('../middleware/validationMiddleware');

router.get('/', protect, getFolders);
router.post('/', protect, validateFolderPayload, createFolder);
router.put('/:id', protect, validateFolderPayload, updateFolder);
router.delete('/:id', protect, deleteFolder);
router.put('/:id/move-document', protect, validateMoveDocumentPayload, moveDocument);

module.exports = router;
