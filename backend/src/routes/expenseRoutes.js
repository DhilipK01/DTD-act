import { Router } from 'express';
import {
  getDayExpenses,
  saveDayExpenses,
  deleteDayExpenses,
  searchExpenses,
  getFoodSuggestions,
  getMonthlyBudget,
  setMonthlyBudget
} from '../controllers/expenseController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All expense routes require authentication
router.use(authenticate);

router.get('/day', getDayExpenses);
router.post('/day', saveDayExpenses);
router.delete('/day', deleteDayExpenses);

router.get('/search', searchExpenses);
router.get('/suggestions', getFoodSuggestions);
router.get('/budget', getMonthlyBudget);
router.post('/budget', setMonthlyBudget);

export default router;
