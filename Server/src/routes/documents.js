const express = require('express');
const router = express.Router();
const documentController = require('../app/controllers/documentController');
const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo = require('../app/middlewares/restrictTo');
const upload = require('../app/middlewares/uploadMiddleware'); // Assuming you have this

router.use(isAuth, restrictTo('TEACHER', 'ADMIN'));

// GET all documents
router.get('/', documentController.getTeacherDocuments);

// POST upload document
router.post('/upload', upload.single('file'), documentController.uploadDocument);

// DELETE document
router.delete('/:id', documentController.deleteDocument);

module.exports = router;