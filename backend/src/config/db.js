import Datastore from '@seald-io/nedb';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = process.env.DATA_DIR || path.resolve(__dirname, '../../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const usersDb = new Datastore({
  filename: path.join(dataDir, 'users.db'),
  autoload: true,
  timestampData: false
});

export const otpsDb = new Datastore({
  filename: path.join(dataDir, 'otps.db'),
  autoload: true,
  timestampData: false
});

export const expensesDb = new Datastore({
  filename: path.join(dataDir, 'expenses.db'),
  autoload: true,
  timestampData: false
});

export const budgetsDb = new Datastore({
  filename: path.join(dataDir, 'budgets.db'),
  autoload: true,
  timestampData: false
});

// Create indexes
await usersDb.ensureIndexAsync({ fieldName: 'email', unique: true });
await usersDb.ensureIndexAsync({ fieldName: 'user_id', unique: true });
await otpsDb.ensureIndexAsync({ fieldName: 'email' });
await expensesDb.ensureIndexAsync({ fieldName: 'user_id' });
await expensesDb.ensureIndexAsync({ fieldName: 'date' });
await expensesDb.ensureIndexAsync({ fieldName: 'expense_id', unique: true });
await budgetsDb.ensureIndexAsync({ fieldName: 'user_id' });

console.log('📦 Database initialized successfully (NeDB data files in /backend/data)');
