import express from 'express';
import Comment from '../models/Comment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/comments
// @desc    Get all comments
// @access  Public
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username');
        res.json({ success: true, comments });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private
router.post('/', authenticate, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const comment = await Comment.create({
            text: text.trim(),
            user: req.user._id,
            username: req.user.username
        });

        res.status(201).json({ success: true, comment });
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment (owner or admin)
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership or admin
        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
