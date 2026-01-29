import express from 'express';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/secrets
// @desc    Get sensitive admin data (demonstrates secure vs insecure access)
// @access  Private/Admin
router.get('/secrets', authenticate, requireRole('admin'), async (req, res) => {
    try {
        // In a real app, these would come from secure environment variables
        // This demonstrates that sensitive data should ONLY be sent after backend auth
        const secrets = {
            apiKey: 'sk_live_51234567890abcdef',
            dbPassword: 'P@ssw0rd123!',
            note: 'This data is protected by backend authentication. It is NOT exposed to non-admin users.'
        };

        res.json({ success: true, secrets });
    } catch (error) {
        console.error('Get secrets error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const commentCount = await Comment.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });

        res.json({
            success: true,
            stats: {
                totalUsers: userCount,
                totalComments: commentCount,
                totalAdmins: adminCount
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
