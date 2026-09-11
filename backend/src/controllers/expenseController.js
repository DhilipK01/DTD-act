import { v4 as uuidv4 } from 'uuid';
import { expensesDb, budgetsDb } from '../config/db.js';

const VALID_SLOTS = ['morning', 'afternoon', 'night'];
const VALID_PAYMENT_METHODS = ['GPay', 'Cash', 'Other'];
const VALID_CATEGORIES = ['outside', 'home'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayOfWeek(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return DAYS[dateObj.getDay()];
}

/**
 * Get expenses for a specific day
 * GET /api/expenses/day?date=YYYY-MM-DD
 */
export async function getDayExpenses(req, res) {
  try {
    const { date } = req.query;
    const userId = req.user.user_id;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Valid date in YYYY-MM-DD format is required' });
    }

    const records = await expensesDb.findAsync({ user_id: userId, date });

    const slots = {
      morning: { amount: 0, payment_method: 'GPay', food_item: '', category: 'outside', expense_id: null },
      afternoon: { amount: 0, payment_method: 'Cash', food_item: '', category: 'outside', expense_id: null },
      night: { amount: 0, payment_method: 'GPay', food_item: '', category: 'outside', expense_id: null }
    };

    let dailyTotal = 0;

    for (const record of records) {
      if (slots[record.time_slot]) {
        const amt = Number(record.amount) || 0;
        slots[record.time_slot] = {
          expense_id: record.expense_id,
          amount: amt,
          payment_method: record.payment_method || 'GPay',
          food_item: record.food_item || '',
          category: record.category || 'outside',
          created_at: record.created_at,
          updated_at: record.updated_at
        };
        dailyTotal += amt;
      }
    }

    return res.status(200).json({
      date,
      day_of_week: getDayOfWeek(date),
      dailyTotal,
      slots,
      hasEntries: records.length > 0
    });
  } catch (error) {
    console.error('Error fetching day expenses:', error);
    return res.status(500).json({ error: 'Failed to fetch day expenses' });
  }
}

/**
 * Save / Update expenses for a specific day (all three slots)
 * POST /api/expenses/day
 */
export async function saveDayExpenses(req, res) {
  try {
    const userId = req.user.user_id;
    const { date, slots } = req.body;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Valid date in YYYY-MM-DD format is required' });
    }

    if (!slots || typeof slots !== 'object') {
      return res.status(400).json({ error: 'Slots object is required' });
    }

    const day_of_week = getDayOfWeek(date);
    const nowIso = new Date().toISOString();
    let dailyTotal = 0;
    const savedSlots = {};

    for (const slotKey of VALID_SLOTS) {
      const slotData = slots[slotKey] || {};
      const amount = Math.max(0, parseFloat(slotData.amount) || 0);
      const payment_method = VALID_PAYMENT_METHODS.includes(slotData.payment_method)
        ? slotData.payment_method
        : 'Other';
      const category = VALID_CATEGORIES.includes(slotData.category)
        ? slotData.category
        : 'outside';
      const food_item = (slotData.food_item || '').trim();

      dailyTotal += amount;

      // Find existing entry for this slot
      const existing = await expensesDb.findOneAsync({
        user_id: userId,
        date,
        time_slot: slotKey
      });

      if (existing) {
        await expensesDb.updateAsync(
          { _id: existing._id },
          {
            $set: {
              amount,
              payment_method,
              food_item,
              category,
              day_of_week,
              updated_at: nowIso
            }
          }
        );
        savedSlots[slotKey] = {
          expense_id: existing.expense_id,
          amount,
          payment_method,
          food_item,
          category,
          updated_at: nowIso
        };
      } else {
        const expense_id = uuidv4();
        const newRecord = {
          expense_id,
          user_id: userId,
          date,
          day_of_week,
          time_slot: slotKey,
          amount,
          payment_method,
          food_item,
          category,
          created_at: nowIso,
          updated_at: nowIso
        };
        await expensesDb.insertAsync(newRecord);
        savedSlots[slotKey] = {
          expense_id,
          amount,
          payment_method,
          food_item,
          category,
          created_at: nowIso
        };
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Expenses saved successfully',
      date,
      day_of_week,
      dailyTotal,
      slots: savedSlots
    });
  } catch (error) {
    console.error('Error saving day expenses:', error);
    return res.status(500).json({ error: 'Failed to save day expenses' });
  }
}

/**
 * Delete all entries for a specific day
 * DELETE /api/expenses/day?date=YYYY-MM-DD
 */
export async function deleteDayExpenses(req, res) {
  try {
    const { date } = req.query;
    const userId = req.user.user_id;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Valid date in YYYY-MM-DD format is required' });
    }

    const removed = await expensesDb.removeAsync({ user_id: userId, date }, { multi: true });

    return res.status(200).json({
      success: true,
      message: `Deleted ${removed} slot entries for ${date}`,
      dailyTotal: 0
    });
  } catch (error) {
    console.error('Error deleting day expenses:', error);
    return res.status(500).json({ error: 'Failed to delete day expenses' });
  }
}

/**
 * Search past expense items
 * GET /api/expenses/search?q=biryani&payment_method=GPay&category=outside
 */
export async function searchExpenses(req, res) {
  try {
    const userId = req.user.user_id;
    const { q, payment_method, category } = req.query;

    const allUserExpenses = await expensesDb.findAsync({ user_id: userId });

    let filtered = allUserExpenses.filter((item) => item.amount > 0 || (item.food_item && item.food_item.trim()));

    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        (item.food_item || '').toLowerCase().includes(term)
      );
    }

    if (payment_method && payment_method !== 'all') {
      filtered = filtered.filter((item) => item.payment_method === payment_method);
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((item) => (item.category || 'outside') === category);
    }

    // Sort by date descending
    filtered.sort((a, b) => b.date.localeCompare(a.date));

    const totalSpend = filtered.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return res.status(200).json({
      count: filtered.length,
      totalSpend,
      results: filtered
    });
  } catch (error) {
    console.error('Error searching expenses:', error);
    return res.status(500).json({ error: 'Failed to search expenses' });
  }
}

/**
 * Get distinct food suggestions for autocomplete
 * GET /api/expenses/suggestions
 */
export async function getFoodSuggestions(req, res) {
  try {
    const userId = req.user.user_id;
    const records = await expensesDb.findAsync({ user_id: userId });

    const foodMap = new Map();

    for (const rec of records) {
      const name = (rec.food_item || '').trim();
      if (!name) continue;

      const key = name.toLowerCase();
      if (!foodMap.has(key)) {
        foodMap.set(key, {
          food_item: name,
          count: 1,
          amount: rec.amount || 0,
          payment_method: rec.payment_method || 'GPay',
          category: rec.category || 'outside',
          time_slot: rec.time_slot || 'morning'
        });
      } else {
        const item = foodMap.get(key);
        item.count += 1;
        // Keep latest amount and payment method
        item.amount = rec.amount || item.amount;
        item.payment_method = rec.payment_method || item.payment_method;
        item.category = rec.category || item.category;
      }
    }

    // Sort by frequency descending
    const suggestions = Array.from(foodMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error getting food suggestions:', error);
    return res.status(500).json({ error: 'Failed to get food suggestions' });
  }
}

/**
 * Get monthly budget
 * GET /api/expenses/budget?year=2026&month=9
 */
export async function getMonthlyBudget(req, res) {
  try {
    const userId = req.user.user_id;
    let { year, month } = req.query;

    if (!year || !month) {
      const now = new Date();
      year = now.getFullYear().toString();
      month = (now.getMonth() + 1).toString();
    }

    const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;

    // First try finding specific month budget
    let budgetRecord = await budgetsDb.findOneAsync({ user_id: userId, year_month: yearMonth });
    
    // If not found, check if user has a default budget
    if (!budgetRecord) {
      budgetRecord = await budgetsDb.findOneAsync({ user_id: userId, is_default: true });
    }

    return res.status(200).json({
      yearMonth,
      budget: budgetRecord ? budgetRecord.amount : 0
    });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return res.status(500).json({ error: 'Failed to fetch budget' });
  }
}

/**
 * Set monthly budget
 * POST /api/expenses/budget
 */
export async function setMonthlyBudget(req, res) {
  try {
    const userId = req.user.user_id;
    const { year, month, amount, setAsDefault } = req.body;

    const numAmount = Math.max(0, parseFloat(amount) || 0);
    const now = new Date();
    const y = year || now.getFullYear().toString();
    const m = (month || now.getMonth() + 1).toString().padStart(2, '0');
    const yearMonth = `${y}-${m}`;

    const existing = await budgetsDb.findOneAsync({ user_id: userId, year_month: yearMonth });

    if (existing) {
      await budgetsDb.updateAsync(
        { _id: existing._id },
        { $set: { amount: numAmount, updated_at: new Date().toISOString() } }
      );
    } else {
      await budgetsDb.insertAsync({
        user_id: userId,
        year_month: yearMonth,
        amount: numAmount,
        is_default: !!setAsDefault,
        created_at: new Date().toISOString()
      });
    }

    if (setAsDefault) {
      await budgetsDb.updateAsync({ user_id: userId }, { $set: { is_default: false } }, { multi: true });
      await budgetsDb.updateAsync({ user_id: userId, year_month: yearMonth }, { $set: { is_default: true } });
    }

    return res.status(200).json({
      success: true,
      yearMonth,
      budget: numAmount
    });
  } catch (error) {
    console.error('Error setting budget:', error);
    return res.status(500).json({ error: 'Failed to set budget' });
  }
}
