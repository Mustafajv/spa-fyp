import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// IDOR (Insecure Direct Object Reference) DEMO
// These routes intentionally lack proper authorization checks
// ============================================

// @route   GET /api/vulnerable/users
// @desc    Get all users (no admin check - VULNERABLE)
// @access  Private (but no role check!)
router.get('/users', authenticate, async (req, res) => {
    try {
        // VULNERABILITY: Any authenticated user can see all users
        const users = await User.find().select('-password');
        res.json({
            success: true,
            users,
            vulnerability: 'IDOR: Any authenticated user can list all users, not just admins!'
        });
    } catch (error) {
        console.error('IDOR Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/vulnerable/users/:id
// @desc    Get any user's profile by ID (no ownership check - VULNERABLE)
// @access  Private (but no ownership verification!)
router.get('/users/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // VULNERABILITY: No check if req.user._id matches req.params.id
        // Any user can view any other user's profile
        res.json({
            success: true,
            user,
            vulnerability: 'IDOR: You accessed another user\'s profile without authorization!',
            yourUserId: req.user._id,
            accessedUserId: req.params.id
        });
    } catch (error) {
        console.error('IDOR Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/vulnerable/users/:id
// @desc    Update any user's profile (no ownership check - VULNERABLE)
// @access  Private (but no ownership verification!)
router.put('/users/:id', authenticate, async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // VULNERABILITY: No check if req.user._id matches req.params.id
        // Any user can modify any other user's profile
        if (username) {
            user.username = username;
            await user.save();
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            },
            vulnerability: 'IDOR: You modified another user\'s profile without authorization!',
            yourUserId: req.user._id.toString(),
            modifiedUserId: req.params.id
        });
    } catch (error) {
        console.error('IDOR Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/vulnerable/users/:id  
// @desc    Delete any user (no admin/ownership check - VULNERABLE)
// @access  Private (but no role or ownership verification!)
router.delete('/users/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // VULNERABILITY: No check for admin role or ownership
        // Any user can delete any other user
        await user.deleteOne();

        res.json({
            success: true,
            message: 'User deleted',
            vulnerability: 'IDOR: You deleted a user without proper authorization!',
            yourUserId: req.user._id.toString(),
            deletedUserId: req.params.id
        });
    } catch (error) {
        console.error('IDOR Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ============================================
// SECURE VERSIONS (for comparison)
// ============================================

// @route   GET /api/vulnerable/secure/users
// @desc    Get users list with proper authorization (SECURE)
// @access  Private - Admins see all, regular users see only themselves
router.get('/secure/users', authenticate, async (req, res) => {
    try {
        // SECURE: Only admins can see all users
        if (req.user.role === 'admin') {
            const users = await User.find().select('-password');
            return res.json({
                success: true,
                users,
                secure: true,
                message: 'Admin access - full user list returned'
            });
        }

        // Regular users can only see their own profile
        const ownProfile = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            users: [ownProfile], // Only return their own profile
            secure: true,
            message: 'Access restricted - you can only see your own profile',
            restricted: true
        });
    } catch (error) {
        console.error('Secure get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/vulnerable/secure/users/:id
// @desc    Get user profile with ownership check (SECURE)
// @access  Private
router.get('/secure/users/:id', authenticate, async (req, res) => {
    try {
        // SECURE: Check if user is accessing their own profile or is admin
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only view your own profile.',
                secure: true
            });
        }

        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            user,
            secure: true,
            message: 'Access granted - proper authorization verified'
        });
    } catch (error) {
        console.error('Secure get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/vulnerable/secure/users/:id
// @desc    Update user profile with ownership check (SECURE)
// @access  Private
router.put('/secure/users/:id', authenticate, async (req, res) => {
    try {
        // SECURE: Check ownership
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update your own profile.',
                secure: true
            });
        }

        const { username } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) {
            user.username = username;
            await user.save();
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            },
            secure: true,
            message: 'Profile updated with proper authorization'
        });
    } catch (error) {
        console.error('Secure update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
