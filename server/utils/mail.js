import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const htmlTemplate = `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f5f7fa; font-family:Segoe UI, Roboto, sans-serif; color:#0f172a;">
    <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
      
      <!-- Header -->
      <div style="background:#0f172a; color:#ffffff; padding:32px 24px; text-align:center;">
        <h1 style="margin:0; font-size:24px;">NOICE</h1>
      </div>

      <!-- Content -->
      <div style="padding:32px 24px; text-align:center;">
        <h2 style="font-size:20px; color:#1e293b; margin-bottom:16px;">Verify Your Email Address</h2>
        <p style="font-size:16px; color:#475569; line-height:1.6; margin-bottom:32px;">
          Use the following One-Time Password (OTP) to complete your login or registration process.
        </p>

        <div style="display:inline-block; background:#f1f5f9; padding:20px 32px; border-radius:8px; font-size:28px; font-weight:bold; letter-spacing:6px; color:#1d4ed8; font-family:'Courier New', monospace; margin-bottom:16px;">
          ${otp}
        </div>

        <div style="font-size:14px; color:#64748b; margin-bottom:32px;">This code is valid for the next 5 minutes.</div>

        <div style="background:#fff0f1; color:#b91c1c; padding:16px; border-left:4px solid #dc2626; font-size:14px; line-height:1.6; margin-bottom:32px; text-align:left; border-radius:4px;">
          <strong>Security Tip:</strong> Do not share this OTP with anyone. Noice will never ask for your OTP via call, email, or message. If you didn’t request this, you can safely ignore this message.
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc; padding:24px; font-size:13px; text-align:center; color:#64748b; border-top:1px solid #e2e8f0;">
        This email was sent to ${email} by Noice Authentication System.<br/>
        <a href="#" style="color:#3b82f6; text-decoration:none; margin:0 12px;">Help</a> | 
        <a href="#" style="color:#3b82f6; text-decoration:none; margin:0 12px;">Privacy</a> | 
        <a href="#" style="color:#3b82f6; text-decoration:none; margin:0 12px;">Terms</a>
      </div>
    </div>
  </body>
</html>
`;

  const mailOptions = {
    from: `Noice Security <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Your Noice Verification Code',
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
