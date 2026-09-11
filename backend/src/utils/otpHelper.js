import crypto from 'crypto';

const OTP_SALT = process.env.OTP_SECRET || 'daily-expense-tracker-secure-otp-salt-key-987';

/**
 * Generate a cryptographically secure 6-digit numeric OTP string
 */
export function generateOtp() {
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0) % 900000 + 100000;
  return num.toString();
}

/**
 * Hash an OTP with a salt using SHA-256
 */
export function hashOtp(otp, email) {
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase().trim()}:${otp}:${OTP_SALT}`)
    .digest('hex');
}

/**
 * Verify provided OTP against stored hash
 */
export function verifyOtpHash(otp, email, storedHash) {
  const hash = hashOtp(otp, email);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}
