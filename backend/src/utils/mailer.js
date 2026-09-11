import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  // Use service: 'gmail' or custom SMTP host
  const isGmail = (process.env.SMTP_HOST || '').includes('gmail') || !process.env.SMTP_HOST;
  
  transporter = nodemailer.createTransport(
    isGmail
      ? {
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS.replace(/\s+/g, '') // remove spaces from Google app passwords
          }
        }
      : {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '465', 10),
          secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        }
  );
} else {
  console.log('ℹ️ SMTP_USER / SMTP_PASS not set in backend/.env — OTP will print to terminal and show Auto-fill in UI.');
}

/**
 * Send 6-digit OTP code to user's email
 */
export async function sendOtpEmail(email, otp) {
  const subject = `Your Verification Code: ${otp} - Daily Expense Tracker`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; background: #10b981; color: white; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; font-size: 24px; font-weight: bold;">₹</div>
        <h2 style="color: #0f172a; margin: 12px 0 4px;">Personal Daily Expense Tracker</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Verification Code for ${email}</p>
      </div>
      
      <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #059669; font-family: monospace;">${otp}</span>
      </div>

      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        Enter this 6-digit code on the verification screen to securely access your personal expense dashboard.
      </p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
        This code will expire in <strong>10 minutes</strong>. If you did not request this code, please ignore this email.
      </p>
    </div>
  `;

  console.log('\n========================================');
  console.log(`🔐 OTP for ${email}: [ ${otp} ] (Valid for 10 min)`);
  console.log('========================================\n');

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Daily Expense Tracker" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject,
        html
      });
      console.log(`✉️ Email successfully dispatched to ${email}`);
      return { sent: true, devMode: false };
    } catch (err) {
      console.error(`⚠️ Failed to send email via SMTP:`, err.message);
      // Fallback dev mode allows user to continue seamlessly
      return { sent: false, devMode: true, devOtp: otp, error: err.message };
    }
  }

  // If no SMTP configured, return devMode flag with OTP for instant developer testing
  return { sent: true, devMode: true, devOtp: otp };
}
