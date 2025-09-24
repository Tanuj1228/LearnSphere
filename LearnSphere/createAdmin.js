require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for Admin Creation...');

        const username = 'admin';
        const password = 'admin123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: username });
        if (existingAdmin) {
            console.log('👍 Admin user already exists.');
            return;
        }

        // Create new admin user
        const adminUser = new User({
            username: username,
            password: password, // Password will be auto-hashed by the model's pre-save hook
            role: 'admin'
        });

        await adminUser.save();
        console.log('🎉 Admin user created successfully!');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('🔌 MongoDB Disconnected.');
    }
};

// Run the function
createAdmin();
