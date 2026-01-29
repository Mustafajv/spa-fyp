import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

dotenv.config();

const seedData = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Comment.deleteMany({});
        console.log('Cleared existing data');

        // Create users (matching the demo credentials)
        const admin = await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });

        const user = await User.create({
            username: 'user',
            password: 'user123',
            role: 'user'
        });

        console.log('Created users:');
        console.log(`  - admin / admin123 (role: admin)`);
        console.log(`  - user / user123 (role: user)`);

        // Create sample comments
        await Comment.create([
            {
                text: 'Welcome to the SPA Security Demo!',
                user: admin._id,
                username: admin.username
            },
            {
                text: 'This is a sample comment from a regular user.',
                user: user._id,
                username: user.username
            }
        ]);

        console.log('Created sample comments');
        console.log('\n✅ Database seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
