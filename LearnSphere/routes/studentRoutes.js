// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subject = require('../models/subjectModel');
const { protect } = require('../middleware/authMiddleware');

let gfs;
mongoose.connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

// GET / - The Homepage
router.get('/', (req, res) => {
    res.render('home');
});


// GET /dashboard - Display the student dashboard
router.get('/dashboard', protect, async (req, res) => {
    try {
        const subjects = await Subject.find({}).sort({ year: 1, name: 1 });
        res.render('dashboard', { user: req.user, subjects: subjects });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// GET /subjects/:id - Display materials for a specific subject
router.get('/subjects/:id', protect, async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).send('Subject not found');
        }
        
        const files = await mongoose.connection.db.collection('uploads.files').find({
            'metadata.subjectId': req.params.id
        }).toArray();
        
        res.render('subject', { user: req.user, subject: subject, files: files });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// GET /download/:fileId - Handle file download
router.get('/download/:fileId', protect, async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.fileId);
        const file = await mongoose.connection.db.collection('uploads.files').findOne({ _id: fileId });

        if (!file) {
            return res.status(404).send('File not found');
        }

        res.set({
            'Content-Type': file.contentType,
            'Content-Disposition': `attachment; filename="${file.metadata.originalName}"`,
        });

        const downloadStream = gfs.openDownloadStream(file._id);
        downloadStream.pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;