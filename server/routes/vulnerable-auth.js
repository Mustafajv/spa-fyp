import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { demoRateLimiter, noRateLimit } from '../middleware/rate-limit.js';

const router = express.Router();

// ============================================
// NoSQL INJECTION DEMO
// ============================================

// @route   POST /api/vulnerable/login
// @desc    Login with NoSQL injection vulnerability
// @access  Public
router.post('/login', noRateLimit, async (req, res) => {
    try {
        const { username, password } = req.body;

        // VULNERABILITY: Directly using user input in query without sanitization
        // Attacker can send: { "username": "admin", "password": { "$gt": "" } }
        // This bypasses password check because { "$gt": "" } is always true

        const user = await User.findOne({
            username: username,
            password: password  // VULNERABLE: If password is an object like {"$gt": ""}, it bypasses auth
        });

        // Note: This won't actually work with bcrypt hashed passwords,
        // but demonstrates the concept. In real vulnerable apps with plain text passwords, this works.

        if (!user) {
            // For demo, let's also show a different vulnerability path
            // Check if injection was attempted
            if (typeof password === 'object') {
                return res.json({
                    success: false,
                    message: 'NoSQL Injection detected! In a vulnerable system with plain-text passwords, this would bypass authentication.',
                    vulnerability: 'NoSQL Injection',
                    payload: password,
                    explanation: 'The payload {"$gt": ""} means "greater than empty string" which is always true, bypassing password validation.'
                });
            }
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        generateToken(res, user._id);

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Vulnerable login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/vulnerable/login-demo
// @desc    Simulated NoSQL injection success (for educational demo)
// @access  Public
router.post('/login-demo', noRateLimit, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if this is an injection attempt for demo purposes
        if (typeof password === 'object' && (password.$gt !== undefined || password.$ne !== undefined)) {
            // Simulate successful bypass for educational purposes
            const targetUser = await User.findOne({ username: username?.toLowerCase?.() || username });

            if (targetUser) {
                return res.json({
                    success: true,
                    bypassed: true,
                    vulnerability: 'NoSQL Injection successful!',
                    message: `Authentication bypassed for user: ${targetUser.username}`,
                    user: {
                        id: targetUser._id,
                        username: targetUser.username,
                        role: targetUser.role
                    },
                    payload: password,
                    explanation: 'In a system with plain-text passwords, the query { password: { "$gt": "" } } returns true for any non-empty password.'
                });
            }
        }

        // Normal login flow
        const user = await User.findOne({ username: username?.toLowerCase?.() || username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login demo error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/vulnerable/login-secure
// @desc    Secure login with input sanitization
// @access  Public
router.post('/login-secure', demoRateLimiter, async (req, res) => {
    try {
        let { username, password } = req.body;

        // SECURE: Sanitize inputs - ensure they are strings
        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid input types. Username and password must be strings.',
                secure: true,
                blocked: 'NoSQL injection attempt blocked!'
            });
        }

        // SECURE: Additional sanitization - remove any MongoDB operators
        username = username.replace(/[$]/g, '');

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        generateToken(res, user._id);

        res.json({
            success: true,
            secure: true,
            message: 'Login successful with sanitized inputs',
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Secure login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ============================================
// RATE LIMITING DEMO
// ============================================

// @route   POST /api/vulnerable/brute-force
// @desc    Endpoint without rate limiting (vulnerable to brute force)
// @access  Public
router.post('/brute-force', noRateLimit, async (req, res) => {
    const { username, password } = req.body;

    // Simulate login attempt
    const user = await User.findOne({ username: username?.toLowerCase?.() || username });

    if (!user) {
        return res.json({
            success: false,
            message: 'Invalid credentials',
            vulnerability: 'No rate limiting! Attackers can try unlimited passwords.',
            attempt: 'allowed'
        });
    }

    const isMatch = await user.matchPassword(password);

    res.json({
        success: isMatch,
        message: isMatch ? 'Login successful!' : 'Invalid credentials',
        vulnerability: 'No rate limiting! Attackers can try unlimited passwords.',
        attempt: 'allowed'
    });
});

// @route   POST /api/vulnerable/brute-force-protected
// @desc    Endpoint with rate limiting (protected from brute force)  
// @access  Public
router.post('/brute-force-protected', demoRateLimiter, async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username?.toLowerCase?.() || username });

    if (!user) {
        return res.json({
            success: false,
            message: 'Invalid credentials',
            secure: true,
            protection: 'Rate limiting active - only 5 attempts per minute allowed'
        });
    }

    const isMatch = await user.matchPassword(password);

    res.json({
        success: isMatch,
        message: isMatch ? 'Login successful!' : 'Invalid credentials',
        secure: true,
        protection: 'Rate limiting active - only 5 attempts per minute allowed'
    });
});

export default router;
