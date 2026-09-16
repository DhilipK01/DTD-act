import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// Mongoose Schemas & Models
// ==========================================

const userSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, default: '' },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password_hash: { type: String, default: '' },
    age: { type: mongoose.Schema.Types.Mixed, default: '' },
    is_verified: { type: Boolean, default: true },
    created_at: { type: String, default: () => new Date().toISOString() }
  },
  { versionKey: false, timestamps: false }
);

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true, lowercase: true, trim: true },
    otp_hash: { type: String, required: true },
    expires_at: { type: String, required: true },
    used: { type: Boolean, default: false },
    created_at: { type: String, default: () => new Date().toISOString() }
  },
  { versionKey: false, timestamps: false }
);

const expenseSchema = new mongoose.Schema(
  {
    expense_id: { type: String, required: true, unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    day_of_week: { type: String, default: '' },
    time_slot: { type: String, enum: ['morning', 'afternoon', 'night'], required: true },
    amount: { type: Number, default: 0 },
    payment_method: { type: String, enum: ['GPay', 'Cash', 'Other'], default: 'Other' },
    food_item: { type: String, default: '' },
    category: { type: String, enum: ['outside', 'home'], default: 'outside' },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() }
  },
  { versionKey: false, timestamps: false }
);

const budgetSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    year_month: { type: String, required: true },
    amount: { type: Number, default: 0 },
    is_default: { type: Boolean, default: false },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() }
  },
  { versionKey: false, timestamps: false }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
export const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
export const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

// ==========================================
// Database Connection & Auto-Migration
// ==========================================

export async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dtd_expenses';
  const maskedUri = uri.replace(/\/\/[^@]+@/, '//***:***@');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`📦 MongoDB connected successfully to ${maskedUri}`);

    // Auto-migrate legacy NeDB data if MongoDB is fresh
    await autoMigrateFromNeDb();
  } catch (err) {
    console.error(`⚠️ MongoDB connection error: ${err.message}`);
    console.error(`👉 Configure MONGODB_URI in backend/.env with your MongoDB Atlas connection string.`);
  }
}

/**
 * Automatically imports records from backend/data/*.db into MongoDB
 * if the MongoDB collections are currently empty.
 */
export async function autoMigrateFromNeDb() {
  try {
    const dataDir = process.env.DATA_DIR || path.resolve(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) return;

    // Migrate Users
    const usersFile = path.join(dataDir, 'users.db');
    if (fs.existsSync(usersFile)) {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🔄 Checking NeDB for existing users to migrate to MongoDB...');
        const lines = fs.readFileSync(usersFile, 'utf8').split('\n').filter(Boolean);
        let migratedUsers = 0;
        for (const line of lines) {
          try {
            const doc = JSON.parse(line);
            if (doc.user_id && doc.email && !doc.$$indexCreated) {
              await User.updateOne(
                { user_id: doc.user_id },
                {
                  $setOnInsert: {
                    user_id: doc.user_id,
                    fullName: doc.fullName || '',
                    email: doc.email.toLowerCase().trim(),
                    password_hash: doc.password_hash || '',
                    age: doc.age || '',
                    is_verified: doc.is_verified ?? true,
                    created_at: doc.created_at || new Date().toISOString()
                  }
                },
                { upsert: true }
              );
              migratedUsers++;
            }
          } catch (e) {}
        }
        if (migratedUsers > 0) {
          console.log(`✅ Successfully migrated ${migratedUsers} users from NeDB to MongoDB!`);
        }
      }
    }

    // Migrate Expenses
    const expensesFile = path.join(dataDir, 'expenses.db');
    if (fs.existsSync(expensesFile)) {
      const expenseCount = await Expense.countDocuments();
      if (expenseCount === 0) {
        console.log('🔄 Checking NeDB for existing expenses to migrate to MongoDB...');
        const lines = fs.readFileSync(expensesFile, 'utf8').split('\n').filter(Boolean);
        let migratedExpenses = 0;
        for (const line of lines) {
          try {
            const doc = JSON.parse(line);
            if (doc.expense_id && doc.user_id && !doc.$$indexCreated) {
              await Expense.updateOne(
                { expense_id: doc.expense_id },
                {
                  $setOnInsert: {
                    expense_id: doc.expense_id,
                    user_id: doc.user_id,
                    date: doc.date,
                    day_of_week: doc.day_of_week || '',
                    time_slot: doc.time_slot,
                    amount: Number(doc.amount) || 0,
                    payment_method: doc.payment_method || 'Other',
                    food_item: doc.food_item || '',
                    category: doc.category || 'outside',
                    created_at: doc.created_at || new Date().toISOString(),
                    updated_at: doc.updated_at || new Date().toISOString()
                  }
                },
                { upsert: true }
              );
              migratedExpenses++;
            }
          } catch (e) {}
        }
        if (migratedExpenses > 0) {
          console.log(`✅ Successfully migrated ${migratedExpenses} expenses from NeDB to MongoDB!`);
        }
      }
    }

    // Migrate Budgets
    const budgetsFile = path.join(dataDir, 'budgets.db');
    if (fs.existsSync(budgetsFile)) {
      const budgetCount = await Budget.countDocuments();
      if (budgetCount === 0) {
        const lines = fs.readFileSync(budgetsFile, 'utf8').split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const doc = JSON.parse(line);
            if (doc.user_id && doc.year_month && !doc.$$indexCreated) {
              await Budget.updateOne(
                { user_id: doc.user_id, year_month: doc.year_month },
                {
                  $setOnInsert: {
                    user_id: doc.user_id,
                    year_month: doc.year_month,
                    amount: Number(doc.amount) || 0,
                    is_default: !!doc.is_default,
                    created_at: doc.created_at || new Date().toISOString(),
                    updated_at: doc.updated_at || new Date().toISOString()
                  }
                },
                { upsert: true }
              );
            }
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    console.warn('NeDB auto-migration skipped or non-fatal:', err.message);
  }
}
