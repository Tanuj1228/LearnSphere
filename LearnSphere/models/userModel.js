const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This is the blueprint for our user data.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true, // No two users can have the same username
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['student', 'admin'], // Role must be one of these two values
        default: 'student'
    }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields


// This is a special function that runs *before* a new user is saved to the database.
// Its job is to securely "hash" the password.
userSchema.pre('save', async function(next) {
    // We only hash the password if it's new or has been modified.
    if (!this.isModified('password')) {
        return next();
    }
    // 'salting' adds random characters to the password before hashing to make it super secure.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model so we can use it in other files
module.exports = User;

