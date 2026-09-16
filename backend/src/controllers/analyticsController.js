import { Expense, Budget } from '../config/db.js';

/**
 * Get monthly analytics, daily breakdown, payment methods, category breakdown, and budget
 * GET /api/analytics/month?year=YYYY&month=MM
 */
export async function getMonthSummary(req, res) {
  try {
    const userId = req.user.user_id;
    let { year, month } = req.query;

    const now = new Date();
    if (!year || !month) {
      year = year || now.getFullYear().toString();
      month = month || (now.getMonth() + 1).toString();
    }

    const paddedMonth = month.toString().padStart(2, '0');
    const monthPrefix = `${year}-${paddedMonth}`;

    // Query all expenses starting with `YYYY-MM`
    const regex = new RegExp(`^${monthPrefix}-\\d{2}$`);
    const records = await Expense.find({
      user_id: userId,
      date: { $regex: regex }
    }).lean();

    let monthlyTotal = 0;
    const paymentMethods = {
      GPay: 0,
      Cash: 0,
      Other: 0
    };
    const slotTotals = {
      morning: 0,
      afternoon: 0,
      night: 0
    };
    const categoryTotals = {
      outside: 0,
      home: 0
    };
    const dailyTotals = {};

    // Total days in this month
    const totalDaysInMonth = new Date(parseInt(year, 10), parseInt(month, 10), 0).getDate();

    // Initialize all days of the month with 0
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dayStr = `${monthPrefix}-${d.toString().padStart(2, '0')}`;
      dailyTotals[dayStr] = {
        date: dayStr,
        day: d,
        total: 0,
        slotCount: 0,
        hasEntries: false
      };
    }

    for (const rec of records) {
      const amt = Number(rec.amount) || 0;
      monthlyTotal += amt;

      // Payment method tally
      if (paymentMethods[rec.payment_method] !== undefined) {
        paymentMethods[rec.payment_method] += amt;
      } else {
        paymentMethods.Other += amt;
      }

      // Slot tally
      if (slotTotals[rec.time_slot] !== undefined) {
        slotTotals[rec.time_slot] += amt;
      }

      // Category tally (outside vs home)
      const cat = rec.category || 'outside';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += amt;
      } else {
        categoryTotals.outside += amt;
      }

      // Daily tally
      if (dailyTotals[rec.date]) {
        dailyTotals[rec.date].total += amt;
        if (amt > 0 || rec.food_item) {
          dailyTotals[rec.date].hasEntries = true;
        }
        dailyTotals[rec.date].slotCount += 1;
      }
    }

    // Convert dailyTotals map to array
    const dailyList = Object.values(dailyTotals).sort((a, b) => a.day - b.day);

    // Calculate percentage breakdown for payment methods
    const paymentBreakdown = {
      GPay: {
        amount: paymentMethods.GPay,
        percentage: monthlyTotal > 0 ? Math.round((paymentMethods.GPay / monthlyTotal) * 100) : 0
      },
      Cash: {
        amount: paymentMethods.Cash,
        percentage: monthlyTotal > 0 ? Math.round((paymentMethods.Cash / monthlyTotal) * 100) : 0
      },
      Other: {
        amount: paymentMethods.Other,
        percentage: monthlyTotal > 0 ? Math.round((paymentMethods.Other / monthlyTotal) * 100) : 0
      }
    };

    // Calculate category breakdown (Home vs Outside food)
    const categoryBreakdown = {
      outside: {
        amount: categoryTotals.outside,
        percentage: monthlyTotal > 0 ? Math.round((categoryTotals.outside / monthlyTotal) * 100) : 0
      },
      home: {
        amount: categoryTotals.home,
        percentage: monthlyTotal > 0 ? Math.round((categoryTotals.home / monthlyTotal) * 100) : 0
      }
    };

    // Budget calculation
    let budgetRecord = await Budget.findOne({ user_id: userId, year_month: monthPrefix }).lean();
    if (!budgetRecord) {
      budgetRecord = await Budget.findOne({ user_id: userId, is_default: true }).lean();
    }
    const budgetAmount = budgetRecord ? budgetRecord.amount : 0;
    const remainingBudget = Math.max(0, budgetAmount - monthlyTotal);
    const isOverBudget = budgetAmount > 0 && monthlyTotal > budgetAmount;
    const budgetPercentage = budgetAmount > 0 ? Math.min(100, Math.round((monthlyTotal / budgetAmount) * 100)) : 0;

    // Remaining days calculation for safe daily spend
    let remainingDays = totalDaysInMonth;
    const isCurrentMonth = now.getFullYear().toString() === year.toString() && (now.getMonth() + 1).toString() === month.toString();
    if (isCurrentMonth) {
      remainingDays = Math.max(1, totalDaysInMonth - now.getDate() + 1);
    }
    const safeDailySpend = budgetAmount > 0 ? Math.round(remainingBudget / remainingDays) : 0;

    return res.status(200).json({
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      monthPrefix,
      monthlyTotal,
      daysInMonth: totalDaysInMonth,
      paymentBreakdown,
      categoryBreakdown,
      slotTotals,
      dailyTotals: dailyList,
      budget: {
        amount: budgetAmount,
        remaining: remainingBudget,
        isOverBudget,
        percentage: budgetPercentage,
        safeDailySpend,
        remainingDays
      }
    });
  } catch (error) {
    console.error('Error in getMonthSummary:', error);
    return res.status(500).json({ error: 'Failed to calculate monthly summary' });
  }
}

/**
 * Get yearly summary and 12-month breakdown
 * GET /api/analytics/year?year=YYYY
 */
export async function getYearSummary(req, res) {
  try {
    const userId = req.user.user_id;
    let { year } = req.query;

    if (!year) {
      year = new Date().getFullYear().toString();
    }

    const yearPrefix = `${year}-`;
    const regex = new RegExp(`^${yearPrefix}\\d{2}-\\d{2}$`);

    const records = await Expense.find({
      user_id: userId,
      date: { $regex: regex }
    }).lean();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const months = monthNames.map((name, index) => {
      const monthNum = index + 1;
      return {
        month: monthNum,
        name,
        shortName: name.slice(0, 3),
        total: 0,
        entryCount: 0,
        outside: 0,
        home: 0
      };
    });

    let yearlyTotal = 0;
    const paymentMethods = { GPay: 0, Cash: 0, Other: 0 };
    const categoryTotals = { outside: 0, home: 0 };

    for (const rec of records) {
      const amt = Number(rec.amount) || 0;
      yearlyTotal += amt;

      const dateParts = rec.date.split('-');
      const monthIndex = parseInt(dateParts[1], 10) - 1;

      const cat = rec.category || 'outside';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += amt;
      } else {
        categoryTotals.outside += amt;
      }

      if (months[monthIndex]) {
        months[monthIndex].total += amt;
        if (cat === 'home') {
          months[monthIndex].home += amt;
        } else {
          months[monthIndex].outside += amt;
        }
        if (amt > 0 || rec.food_item) {
          months[monthIndex].entryCount += 1;
        }
      }

      if (paymentMethods[rec.payment_method] !== undefined) {
        paymentMethods[rec.payment_method] += amt;
      } else {
        paymentMethods.Other += amt;
      }
    }

    return res.status(200).json({
      year: parseInt(year, 10),
      yearlyTotal,
      months,
      paymentBreakdown: paymentMethods,
      categoryBreakdown: categoryTotals,
      averageMonthlySpend: Math.round(yearlyTotal / 12)
    });
  } catch (error) {
    console.error('Error in getYearSummary:', error);
    return res.status(500).json({ error: 'Failed to calculate yearly summary' });
  }
}
