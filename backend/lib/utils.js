import crypto from "crypto";

export const prepareVerificationEmail = (verificationToken, email, name) => {
  const BASE_URL = process.env.CLIENT_URL || "http://localhost:5000";
  const verificationUrl = `${BASE_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Store Your Needs",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: #f8f6fc;">
        <h1 style="color: #7c3aed; text-align: center;">Welcome to Store Your Needs!</h1>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for signing up to our ecommerce platform! Please click the button below to verify your email address and start shopping:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; box-shadow: 0 2px 8px #e9d5ff;">
            Verify My Email
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b21a8;">${verificationUrl}</p>
        <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9d5ff;">
        <p style="color: #a78bfa; font-size: 12px;">
          If you didn't create an account, please ignore this email.<br>
          &copy; ${new Date().getFullYear()} Store Your Needs by Divya.
        </p>
      </div>
    `,
  };

  return mailOptions;
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
