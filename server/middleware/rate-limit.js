import rateLimit from 'express-rate-limit';

// Strict rate limiter for login attempts (secure mode)
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.',
        blocked: true,
        retryAfter: 15
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests from counting
    skipSuccessfulRequests: true
});

// Demo rate limiter with visible counter (for educational purposes)
export const demoRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window for demo
    max: 5, // 5 attempts per minute
    message: {
        success: false,
        message: 'Rate limit exceeded! Only 5 attempts allowed per minute.',
        blocked: true,
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(429).json({
            ...options.message,
            attemptsRemaining: 0,
            windowMs: options.windowMs
        });
    }
});

// No rate limiting (vulnerable - for demo purposes)
export const noRateLimit = (req, res, next) => {
    // Just pass through - no protection
    next();
};
