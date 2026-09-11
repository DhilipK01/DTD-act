// Map of email -> array of request timestamps
const otpRequestLog = new Map();

const MAX_OTP_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Middleware to rate-limit OTP generation by email address (max 5 per hour)
 */
export function rateLimitOtp(req, res, next) {
  const email = (req.body.email || '').toLowerCase().trim();
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const now = Date.now();
  const timestamps = otpRequestLog.get(email) || [];

  // Filter out timestamps older than WINDOW_MS
  const validTimestamps = timestamps.filter(ts => now - ts < WINDOW_MS);

  if (validTimestamps.length >= MAX_OTP_PER_HOUR) {
    const oldest = validTimestamps[0];
    const minutesLeft = Math.ceil((oldest + WINDOW_MS - now) / (60 * 1000));
    return res.status(429).json({
      error: `Too many OTP requests for this email. Please wait ${minutesLeft} minute(s) before requesting again.`
    });
  }

  validTimestamps.push(now);
  otpRequestLog.set(email, validTimestamps);
  next();
}
