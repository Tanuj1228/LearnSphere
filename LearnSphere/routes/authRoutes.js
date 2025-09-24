const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import our User blueprint
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- ROUTES ---

// GET /auth/signup - Display the signup page
router.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

// POST /auth/signup - Handle new user registration
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('signup', { error: 'Username already exists. Please choose another.' });
        }

        // Create a new user (password will be auto-hashed by the pre-save hook in userModel)
        const user = new User({ username, password });
        await user.save();

        // Redirect to login page after successful signup
        res.redirect('/auth/login');

    } catch (error) {
        console.error("Signup Error:", error);
        res.render('signup', { error: 'An error occurred during registration.' });
    }
});

// GET /auth/login - Display the login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST /auth/login - Handle user login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // 1. Check if user exists
        if (!user) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        // 2. Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        // 3. Create JWT Token if login is successful
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        
        // 4. Send the token to the user's browser in a cookie
        res.cookie('token', token, {
            httpOnly: true, // Makes the cookie inaccessible to client-side JS
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        });
        
        // 5. Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin/panel'); // We will create this route later
        } else {
            res.redirect('/dashboard'); // We will create this route later
        }

    } catch (error) {
        console.error("Login Error:", error);
        res.render('login', { error: 'An error occurred during login.' });
    }
});


module.exports = router;
