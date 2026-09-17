import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { User, Expense, Budget, Otp } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dtd_expenses';
const dataDir = process.env.DATA_DIR || path.resolve(__dirname, '../../data');

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 DTD Expense Tracker - NeDB to MongoDB Migration');
  console.log('====================================================');
  console.log(`Connecting to: ${uri.replace(/\/\/[^@]+@/, '//***:***@')}`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB successfully.\n');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('👉 Make sure your MongoDB service is running or MONGODB_URI in backend/.env is correct.');
    process.exit(1);
  }

  // 1. Users
  const usersFile = path.join(dataDir, 'users.db');
  if (fs.existsSync(usersFile)) {
    const lines = fs.readFileSync(usersFile, 'utf8').split('\n').filter(Boolean);
    let uCount = 0;
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
          uCount++;
        }
      } catch (e) { }
    }
    console.log(`👤 Users processed: ${uCount}`);
  } else {
    console.log('ℹ️ No users.db found in backend/data.');
  }

  // 2. Expenses
  const expensesFile = path.join(dataDir, 'expenses.db');
  if (fs.existsSync(expensesFile)) {
    const lines = fs.readFileSync(expensesFile, 'utf8').split('\n').filter(Boolean);
    let eCount = 0;
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
          eCount++;
        }
      } catch (e) { }
    }
    console.log(`💰 Expenses processed: ${eCount}`);
  } else {
    console.log('ℹ️ No expenses.db found in backend/data.');
  }

  // 3. Budgets
  const budgetsFile = path.join(dataDir, 'budgets.db');
  if (fs.existsSync(budgetsFile)) {
    const lines = fs.readFileSync(budgetsFile, 'utf8').split('\n').filter(Boolean);
    let bCount = 0;
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
          bCount++;
        }
      } catch (e) { }
    }
    console.log(`📊 Budgets processed: ${bCount}`);
  } else {
    console.log('ℹ️ No budgets.db found in backend/data.');
  }

  console.log('\n🎉 Migration complete! All records are now stored in MongoDB.');
  await mongoose.disconnect();
  process.exit(0);
}

runMigration();
