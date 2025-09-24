// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const Subject = require('../models/subjectModel');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protect, isAdmin);

// GET /admin/panel
router.get('/panel', async (req, res) => {
    try {
        const subjects = await Subject.find({}).sort({ year: 1, name: 1 });
        // --- NEW --- Fetch all uploaded files from the 'uploads.files' collection
        const files = await mongoose.connection.db.collection('uploads.files').find().toArray();
        
        res.render('admin-panel', { subjects: subjects, user: req.user, files: files }); // <-- Pass files to the view
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// ... (keep the POST /admin/subjects and POST /admin/subjects/delete/:id routes as they are)
router.post('/subjects', async (req, res) => {
    try {
        await new Subject({ name: req.body.name, year: req.body.year }).save();
        res.redirect('/admin/panel');
    } catch (error) { res.redirect('/admin/panel'); }
});

router.post('/subjects/delete/:id', async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.redirect('/admin/panel');
    } catch (error) { res.redirect('/admin/panel'); }
});


// POST /admin/materials/upload
router.post('/materials/upload', upload.single('materialFile'), (req, res) => {
    const { buffer, originalname, mimetype } = req.file;
    const { subjectId, category } = req.body;

    const readableFileStream = Readable.from(buffer);
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const uploadStream = bucket.openUploadStream(originalname, {
        contentType: mimetype,
        metadata: { originalName: originalname, subjectId: subjectId, category: category }
    });

    readableFileStream.pipe(uploadStream);

    uploadStream.on('finish', () => res.redirect('/admin/panel'));
    uploadStream.on('error', () => res.status(500).send('File upload failed.'));
});

// --- NEW --- POST /admin/materials/delete/:id - Delete a file
router.post('/materials/delete/:id', async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        await bucket.delete(fileId);
        res.redirect('/admin/panel');
    } catch (error) {
        console.error('File deletion error:', error);
        res.status(500).send('Error deleting file');
    }
});


module.exports = router;