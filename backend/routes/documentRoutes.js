const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateDocumentUpdatePayload } = require('../middleware/validationMiddleware');
const {
  uploadDocument,
  getDocuments,
  getTrashedDocuments,
  getRecentDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
  permanentDelete,
  downloadDocument,
} = require('../controllers/documentController');

// /trash must come before /:id to avoid route conflict
router.get('/trash', protect, getTrashedDocuments);
router.get('/recent', protect, getRecentDocuments);

router.route('/')
  .get(protect, getDocuments)
  .post(protect, upload.single('file'), uploadDocument);

router.route('/:id')
  .get(protect, getDocument)
  .put(protect, validateDocumentUpdatePayload, updateDocument)
  .delete(protect, deleteDocument);

router.put('/:id/restore', protect, restoreDocument);
router.delete('/:id/permanent', protect, permanentDelete);
router.get('/:id/download', protect, downloadDocument);

module.exports = router;
