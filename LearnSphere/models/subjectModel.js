const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    // We can add more fields here later, like a description.
}, { timestamps: true });


const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;

