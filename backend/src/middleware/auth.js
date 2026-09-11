import jwt from 'jsonwebtoken';
import { usersDb } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'daily-expense-jwt-super-secret-key-321';

export function authenticate(req, res, next) {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    usersDb.findOne({ user_id: decoded.user_id }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Invalid user session' });
      }
      if (!user.is_verified) {
        return res.status(403).json({ error: 'User is not verified' });
      }

      req.user = {
        user_id: user.user_id,
        email: user.email,
        fullName: user.fullName || '',
        age: user.age || '',
        created_at: user.created_at || '',
        is_verified: user.is_verified
      };
      next();
    });
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
  }
}
