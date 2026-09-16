import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { User, Otp } from '../config/db.js';
import { generateOtp, hashOtp, verifyOtpHash } from '../utils/otpHelper.js';
import { hashPassword, verifyPassword } from '../utils/passwordHelper.js';
import { sendOtpEmail } from '../utils/mailer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'daily-expense-jwt-super-secret-key-321';

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  };
}

function getClearCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  };
}

/**
 * Sign Up with Full Name, Gmail ID (email), Password, Age
 */
export async function signup(req, res) {
  try {
    const { fullName, email: rawEmail, password, age } = req.body;

    const email = (rawEmail || '').toLowerCase().trim();
    const name = (fullName || '').trim();
    const pwd = (password || '').trim();
    const userAge = parseInt(age, 10);

    if (!name) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid Gmail / email address.' });
    }

    if (!pwd || pwd.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
    }

    if (isNaN(userAge) || userAge < 1 || userAge > 120) {
      return res.status(400).json({ error: 'Please enter a valid age (1-120).' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If the account exists but has no password (e.g. created via earlier OTP verification):
      if (!existingUser.password_hash) {
        const updateData = {
          fullName: name || existingUser.fullName || email.split('@')[0],
          password_hash: hashPassword(pwd),
          age: userAge || existingUser.age || 20,
          is_verified: true
        };
        await User.updateOne({ user_id: existingUser.user_id }, { $set: updateData });
        const updatedUser = await User.findOne({ user_id: existingUser.user_id }).lean();
        console.log(`👤 Legacy/OTP user account upgraded with password on signup: ${email}`);

        // Generate JWT
        const token = jwt.sign(
          { user_id: updatedUser.user_id, email: updatedUser.email },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        // Set cookie
        res.cookie('token', token, getCookieOptions());

        return res.status(200).json({
          success: true,
          message: 'Account updated successfully with your password.',
          token,
          user: {
            user_id: updatedUser.user_id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            age: updatedUser.age,
            is_verified: true,
            created_at: updatedUser.created_at
          }
        });
      }

      return res.status(400).json({ error: 'An account with this email already exists. Please sign in or reset your password.' });
    }

    const newUser = {
      user_id: uuidv4(),
      fullName: name,
      email,
      password_hash: hashPassword(pwd),
      age: userAge,
      is_verified: true,
      created_at: new Date().toISOString()
    };

    const inserted = await User.create(newUser);
    console.log(`👤 New user registered via password signup: ${email} (${name}, Age: ${userAge})`);

    // Generate JWT
    const token = jwt.sign(
      { user_id: inserted.user_id, email: inserted.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie
    res.cookie('token', token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        user_id: inserted.user_id,
        fullName: inserted.fullName,
        email: inserted.email,
        age: inserted.age,
        is_verified: true,
        created_at: inserted.created_at
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}

/**
 * Sign In with Email ID and Password
 */
export async function login(req, res) {
  try {
    const { email: rawEmail, password } = req.body;

    const email = (rawEmail || '').toLowerCase().trim();
    const pwd = (password || '').trim();

    if (!email || !pwd) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // If account was created with OTP or doesn't have a password yet, set it now seamlessly
    if (!user.password_hash) {
      if (pwd.length < 4) {
        return res.status(400).json({
          error: 'Please enter a password with at least 4 characters to set up your account.'
        });
      }
      const newHash = hashPassword(pwd);
      await User.updateOne(
        { user_id: user.user_id },
        { $set: { password_hash: newHash, fullName: user.fullName || email.split('@')[0] } }
      );
      user.password_hash = newHash;
      console.log(`🔐 Password automatically initialized for legacy/OTP user: ${email}`);
    } else {
      const isValid = verifyPassword(pwd, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie
    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        user_id: user.user_id,
        fullName: user.fullName || '',
        email: user.email,
        age: user.age || '',
        is_verified: true,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ error: 'Failed to sign in. Please try again.' });
  }
}

/**
 * Reset password using email verification code (OTP)
 */
export async function resetPassword(req, res) {
  try {
    const { email: rawEmail, otp, newPassword } = req.body;
    const email = (rawEmail || '').toLowerCase().trim();
    const pwd = (newPassword || '').trim();
    const otpCode = (otp || '').trim();

    if (!email || !otpCode || !pwd) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    if (pwd.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
    }

    const otps = await Otp.find({ email, used: false }).lean();
    const now = new Date().toISOString();

    const validOtp = otps
      .filter(entry => entry.expires_at > now)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired verification code. Please request a new code.' });
    }

    const isMatch = verifyOtpHash(otpCode, email, validOtp.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect verification code. Please try again.' });
    }

    // Mark OTP used
    await Otp.updateOne({ _id: validOtp._id }, { $set: { used: true } });

    let user = await User.findOne({ email });
    const newHash = hashPassword(pwd);

    if (!user) {
      const newUser = {
        user_id: uuidv4(),
        email,
        fullName: email.split('@')[0],
        password_hash: newHash,
        age: '',
        is_verified: true,
        created_at: now
      };
      user = await User.create(newUser);
    } else {
      await User.updateOne(
        { user_id: user.user_id },
        { $set: { password_hash: newHash, is_verified: true } }
      );
      user.password_hash = newHash;
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You are now logged in.',
      token,
      user: {
        user_id: user.user_id,
        fullName: user.fullName || '',
        email: user.email,
        age: user.age || '',
        is_verified: true,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
}

/**
 * Get currently authenticated user profile
 */
export async function getMe(req, res) {
  try {
    const user = await User.findOne({ user_id: req.user.user_id }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({
      user: {
        user_id: user.user_id,
        fullName: user.fullName || '',
        email: user.email,
        age: user.age || '',
        is_verified: user.is_verified,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

/**
 * Logout and clear session cookie
 */
export async function logout(req, res) {
  res.clearCookie('token', getClearCookieOptions());
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}

/**
 * Request 6-digit OTP for signup / login (Retained for backwards compatibility)
 */
export async function sendOtp(req, res) {
  try {
    const rawEmail = req.body.email || '';
    const email = rawEmail.toLowerCase().trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const otp = generateOtp();
    const otp_hash = hashOtp(otp, email);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await Otp.updateMany({ email, used: false }, { $set: { used: true } });

    await Otp.create({
      email,
      otp_hash,
      expires_at,
      used: false,
      created_at: new Date().toISOString()
    });

    const mailResult = await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: mailResult.devMode
        ? 'Real email sending is disabled because SMTP is not configured in backend/.env. Use the code shown below.'
        : `A 6-digit verification code was sent to ${email}.`,
      expiresInMinutes: 10,
      devOtp: mailResult.devMode ? otp : undefined
    });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    return res.status(500).json({ error: 'Failed to generate and send OTP. Please try again.' });
  }
}

/**
 * Verify 6-digit OTP and issue JWT session (Retained for backwards compatibility)
 */
export async function verifyOtp(req, res) {
  try {
    const rawEmail = req.body.email || '';
    const email = rawEmail.toLowerCase().trim();
    const otp = (req.body.otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and 6-digit OTP code are required.' });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'OTP must be a 6-digit number.' });
    }

    const otps = await Otp.find({ email, used: false }).lean();
    const now = new Date().toISOString();

    const validOtp = otps
      .filter(entry => entry.expires_at > now)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP code. Please request a new one.' });
    }

    const isMatch = verifyOtpHash(otp, email, validOtp.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect OTP code. Please check and try again.' });
    }

    await Otp.updateOne({ _id: validOtp._id }, { $set: { used: true } });

    let user = await User.findOne({ email });
    const nowIso = new Date().toISOString();

    if (!user) {
      const newUser = {
        user_id: uuidv4(),
        email,
        fullName: email.split('@')[0],
        age: '',
        is_verified: true,
        created_at: nowIso
      };
      user = await User.create(newUser);
    } else {
      if (!user.is_verified) {
        await User.updateOne({ user_id: user.user_id }, { $set: { is_verified: true } });
        user.is_verified = true;
      }
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        user_id: user.user_id,
        fullName: user.fullName || '',
        email: user.email,
        age: user.age || '',
        is_verified: user.is_verified,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
  }
}
