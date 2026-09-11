import { Router } from 'express';
import { getMonthSummary, getYearSummary } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

router.get('/month', getMonthSummary);
router.get('/year', getYearSummary);

export default router;
