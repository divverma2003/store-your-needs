export const prepareVerificationEmail = (verificationToken, email, name) => {
  const BASE_URL = process.env.CLIENT_URL || "http://localhost:5000";
  const verificationUrl = `${BASE_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Chat With Me",
    html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #4CAF50; text-align: center;">Welcome to Chat With Me!</h1>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for registering! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify My Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
  };

  return mailOptions;
};
