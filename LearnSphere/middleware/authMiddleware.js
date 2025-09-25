const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to check if user is authenticated
exports.protect = async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        try {
            // Get token from cookie
            token = req.cookies.token;

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (don't select the password)
            req.user = await User.findById(decoded.id).select('-password');
            
            // If user not found for that token
            if (!req.user) {
                return res.status(401).redirect('/auth/login');
            }
            
            next(); // User is authenticated, proceed to the next function
        } catch (error) {
            console.error(error);
            // If token is invalid or expired
            return res.status(401).redirect('/auth/login');
        }
    }

    if (!token) {
        // If no token at all
        res.status(401).redirect('/auth/login');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        // If user is logged in but not an admin
        res.status(403).send('Forbidden: You do not have permission to access this resource.');
    }
};