import { Router } from 'express';
import { signup, login, sendOtp, verifyOtp, resetPassword, getMe, logout } from '../controllers/authController.js';
import { rateLimitOtp } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', rateLimitOtp, sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
