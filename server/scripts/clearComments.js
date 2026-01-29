import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Clear all comments with XSS payloads
async function clearComments() {
    try {
        const Comment = mongoose.model('Comment', new mongoose.Schema({
            text: String,
            user: mongoose.Schema.Types.ObjectId,
            username: String
        }));

        // Delete all comments (fresh start)
        const result = await Comment.deleteMany({});
        console.log(`Deleted ${result.deletedCount} comments`);

        // Alternatively, just delete XSS payloads:
        // await Comment.deleteMany({ text: { $regex: /<|>|script|onerror|onload/i } });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

clearComments();
