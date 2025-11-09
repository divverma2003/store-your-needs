import { redis } from "./redis.js";
import crypto from "crypto";
import { stripe } from "./stripe.js";
import jwt from "jsonwebtoken";
import Coupon from "../models/coupon.model.js";
export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
export const prepareEmailChangeVerification = (
  verificationToken,
  email,
  name
) => {
  const BASE_URL = process.env.CLIENT_URL || "http://localhost:5000/api/auth";
  const verificationUrl = `${BASE_URL}/verify-email-change/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your New Email Address - Store Your Needs",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email Change</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
        <div style="min-height: 100vh; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 50%; margin: 0 auto 20px; display: table-cell; vertical-align: middle; text-align: center; line-height: 80px; border: 3px solid rgba(255, 255, 255, 0.3);">
                <span style="font-size: 40px; color: white;">📧</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Verify Your New Email</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Store Your Needs</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                We received a request to change your email address to <strong style="color: #059669;">${email}</strong>.
              </p>

              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                To complete this change and verify ownership of this email address, please click the button below:
              </p>

              <!-- Verification Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: transform 0.2s;">
                  Verify New Email Address
                </a>
              </div>

              <!-- Security Notice -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <p style="color: #78350f; margin: 0 0 10px; font-weight: 600; font-size: 16px;">⚠️ Important Information</p>
                <ul style="color: #78350f; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                  <li>This verification link will expire in <strong>24 hours</strong></li>
                  <li>Your email will <strong>not</strong> change until you verify this address</li>
                  <li>You can still access your account with your current email</li>
                  <li>If you didn't request this change, please ignore this email</li>
                </ul>
              </div>

              <!-- Alternative Link -->
              <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <p style="color: #1f2937; margin: 0 0 10px; font-weight: 600; font-size: 14px;">Can't click the button?</p>
                <p style="color: #4b5563; margin: 0 0 10px; font-size: 13px;">Copy and paste this link into your browser:</p>
                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; word-break: break-all; font-family: 'Courier New', monospace; font-size: 12px; color: #059669;">
                  ${verificationUrl}
                </div>
              </div>

              <!-- What Happens Next -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                <p style="color: #1e40af; margin: 0 0 10px; font-weight: 600; font-size: 16px;">📝 What happens next?</p>
                <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
                  Once you verify this email address, your account email will be updated. You'll receive a confirmation email at both your old and new email addresses.
                </p>
              </div>

              <!-- Help Section -->
              <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Need help? <a href="${BASE_URL}/support" style="color: #059669; text-decoration: none; font-weight: 600;">Contact Support</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">
                This verification was sent to ${email} because someone requested to change the email address on a Store Your Needs account.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Store Your Needs. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </body>
      </html>
    `,
  };
  return mailOptions;
};

export const preparePasswordChangeNotification = (email, name) => {
  const BASE_URL = process.env.CLIENT_URL || "http://localhost:5000/api/auth";
  const resetUrl = `${BASE_URL}/reset-password`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Changed - Store Your Needs",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
        <div style="min-height: 100vh; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255, 255, 255, 0.3);">
                <div style="font-size: 40px; color: white;">🔐</div>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Password Changed</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Store Your Needs</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Your password was recently changed on <strong>${new Date().toLocaleString()}</strong>.
              </p>

              <!-- Security Notice -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <p style="color: #78350f; margin: 0 0 10px; font-weight: 600; font-size: 16px;">⚠️ Didn't make this change?</p>
                <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.6;">
                  If you did not authorize this password change, your account may be compromised. Please reset your password immediately and contact our support team.
                </p>
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); margin: 0 10px 10px;">
                  Reset Password
                </a>
                <a href="${BASE_URL}" style="display: inline-block; background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3); margin: 0 10px 10px;">
                  Visit Store Your Needs
                </a>
              </div>

              <!-- Additional Security Tips -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                  <strong>Security Notice:</strong> This verification link will expire in 24 hours for your protection.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">
                This is an automated security notification.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Store Your Needs. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </body>
      </html>
    `,
  };
  return mailOptions;
};

export const prepareVerificationEmail = (verificationToken, email, name) => {
  const BASE_URL = process.env.CLIENT_URL || "http://localhost:5000/api/auth";
  const verificationUrl = `${BASE_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Store Your Needs",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%); border-radius: 12px; overflow: hidden;">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; position: relative;">
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 16px; padding: 20px; display: inline-block; border: 1px solid rgba(255,255,255,0.2);">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 50%; margin: 0 auto 15px; display: table-cell; vertical-align: middle; text-align: center;">
              <span style="font-size: 24px; color: #059669; line-height: 60px;">✉</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Store Your Needs</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px; font-weight: 500;">Premium Shopping Experience</p>
          </div>
        </div>

        <!-- Content Section -->
        <div style="background: white; padding: 40px 30px;">
          <h2 style="color: #064e3b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Welcome to Our Community!</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi <strong style="color: #059669;">${name}</strong>,</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
            Thank you for joining Store Your Needs! We're excited to have you on board. To complete your registration and start exploring our premium collection, please verify your email address below:
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}"
               style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                      color: white; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 50px; 
                      font-weight: 600; 
                      font-size: 16px;
                      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                      transition: all 0.3s ease;
                      display: inline-block;
                      border: 2px solid rgba(255,255,255,0.2);">
              Verify My Email Address
            </a>
          </div>

          <!-- Alternative Link -->
          <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px; font-weight: 500;">Can't click the button? Copy and paste this link:</p>
            <p style="word-break: break-all; color: #059669; font-size: 14px; margin: 0; font-family: monospace; background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${verificationUrl}</p>
          </div>

          <!-- Security Notice -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
              <strong>Security Notice:</strong> This verification link will expire in 24 hours for your protection.
            </p>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="background: #064e3b; padding: 30px; text-align: center;">
          <div style="border-top: 1px solid rgba(16, 185, 129, 0.3); padding-top: 20px;">
            <p style="color: #a7f3d0; font-size: 12px; margin: 0 0 8px; line-height: 1.5;">
              If you didn't create this account, please ignore this email.
            </p>
            <p style="color: #6ee7b7; font-size: 13px; margin: 0; font-weight: 500;">
              &copy; ${new Date().getFullYear()} Store Your Needs by &lt;div&gt;ya
            </p>
          </div>
        </div>
      </div>
    `,
  };
  return mailOptions;
};

export const preparePurchaseSuccessEmail = (email, name, orderDetails) => {
  const BASE_URL = process.env.CLIENT_URL || "http://localhost:5000";

  // Generate product list HTML with professional styling
  const productListHTML = orderDetails.products
    .map(
      (product) => `
    <tr style="border-bottom: 1px solid rgba(16, 185, 129, 0.1);">
      <td style="padding: 16px 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${product.image}" alt="${
        product.name
      }" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid #e5e7eb;">
          <div>
            <p style="margin: 0; font-weight: 600; color: #064e3b; font-size: 14px;">${
              product.name
            }</p>
          </div>
        </div>
      </td>
      <td style="padding: 16px 12px; text-align: center; font-weight: 500; color: #059669;">${
        product.quantity
      }</td>
      <td style="padding: 16px 12px; text-align: right; font-weight: 500; color: #374151;">$${product.price.toFixed(
        2
      )}</td>
      <td style="padding: 16px 12px; text-align: right; font-weight: 600; color: #059669;">$${(
        product.price * product.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Confirmation - Store Your Needs",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%); border-radius: 12px; overflow: hidden;">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; position: relative;">
          <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 16px; padding: 20px; display: inline-block; border: 1px solid rgba(255,255,255,0.2);">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 50%; margin: 0 auto 15px; display: table-cell; vertical-align: middle; text-align: center;">
              <span style="font-size: 24px; color: #059669; line-height: 60px;">✅</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Order Confirmed!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px; font-weight: 500;">Store Your Needs</p>
          </div>
        </div>

        <!-- Content Section -->
        <div style="background: white; padding: 40px 30px;">
          <h2 style="color: #064e3b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Thank You for Your Purchase!</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi <strong style="color: #059669;">${name}</strong>,</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
            Your order has been confirmed and is now being processed. We're excited to get your items to you soon!
          </p>

          <!-- Order Details Card -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 16px; padding: 24px; margin: 30px 0; border: 1px solid #bbf7d0;">
            <h3 style="color: #064e3b; margin: 0 0 16px; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              Order Details
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px; font-weight: 500;">Order ID</p>
                <p style="color: #059669; font-size: 14px; margin: 0; font-family: monospace; font-weight: 600;">#${orderDetails.id
                  .toString()
                  .slice(-8)
                  .toUpperCase()}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px; font-weight: 500;">Order Date</p>
                <p style="color: #374151; font-size: 14px; margin: 0; font-weight: 600;">${new Date().toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}</p>
              </div>
            </div>
          </div>

          <!-- Products Table -->
          <div style="background: white; border-radius: 16px; overflow: hidden; margin: 30px 0; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 16px 20px;">
              <h3 style="color: white; margin: 0; font-size: 18px; font-weight: 600;">Items Ordered</h3>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #374151; font-size: 14px;">Product</th>
                  <th style="padding: 16px 12px; text-align: center; font-weight: 600; color: #374151; font-size: 14px;">Qty</th>
                  <th style="padding: 16px 12px; text-align: right; font-weight: 600; color: #374151; font-size: 14px;">Price</th>
                  <th style="padding: 16px 12px; text-align: right; font-weight: 600; color: #374151; font-size: 14px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${productListHTML}
              </tbody>
            </table>
            
            <!-- Total Section -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 24px; border-top: 2px solid #10b981;">
              <div style="text-align: right;">
                <p style="font-size: 20px; font-weight: 700; color: #064e3b; margin: 0;">
                  Total Amount: <span style="color: #059669;">$${orderDetails.totalAmount.toFixed(
                    2
                  )}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #3b82f6;">
            <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">
              <strong>What's Next?</strong> You'll receive a shipping confirmation email with tracking information once your order ships.
            </p>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="background: #064e3b; padding: 30px; text-align: center;">
          <div style="border-top: 1px solid rgba(16, 185, 129, 0.3); padding-top: 20px;">
            <p style="color: #a7f3d0; font-size: 12px; margin: 0 0 8px; line-height: 1.5;">
              Questions about your order? Contact us at support@storeyourneeds.com
            </p>
            <p style="color: #6ee7b7; font-size: 13px; margin: 0; font-weight: 500;">
              &copy; ${new Date().getFullYear()} Store Your Needs by &lt;div&gt;ya
            </p>
          </div>
        </div>
      </div>
    `,
  };
  return mailOptions;
};

export const preparePasswordResetEmail = (token, email, name) => {
  const BASE_URL = process.env.CLIENT_URL || "http://localhost:5000/api/auth";
  const resetUrl = `${BASE_URL}/reset-password-confirm/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - Store Your Needs",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
        <div style="min-height: 100vh; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 50%; margin: 0 auto 20px; display: table-cell; vertical-align: middle; text-align: center; line-height: 80px; border: 3px solid rgba(255, 255, 255, 0.3);">
                <span style="font-size: 40px; color: white;">🔑</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Reset Your Password</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Store Your Needs</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>

              <!-- Reset Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: transform 0.2s;">
                  Reset Password
                </a>
              </div>

              <!-- Security Notice -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <p style="color: #78350f; margin: 0 0 10px; font-weight: 600; font-size: 16px;">⚠️ Important Security Information</p>
                <ul style="color: #78350f; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password will not change unless you click the link above</li>
                </ul>
              </div>

              <!-- Alternative Link -->
              <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <p style="color: #1f2937; margin: 0 0 10px; font-weight: 600; font-size: 14px;">Can't click the button?</p>
                <p style="color: #4b5563; margin: 0 0 10px; font-size: 13px;">Copy and paste this link into your browser:</p>
                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; word-break: break-all; font-family: 'Courier New', monospace; font-size: 12px; color: #059669;">
                  ${resetUrl}
                </div>
              </div>

              <!-- Help Section -->
              <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Need help? <a href="${BASE_URL}/support" style="color: #059669; text-decoration: none; font-weight: 600;">Contact Support</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Store Your Needs. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </body>
      </html>
    `,
  };
  return mailOptions;
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const createStripeCoupon = async (discountPercentage) => {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
};

export const createNewCoupon = async (userId) => {
  await Coupon.findOneAndDelete({ userId });
  const MIN_OFF = 2;
  const MAX_OFF = 40;
  const newCoupon = new Coupon({
    code:
      "HAPPYWEEK" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage:
      Math.floor(Math.random() * (MAX_OFF - MIN_OFF + 1)) + MIN_OFF, // random integer between 2 and 40
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    userId: userId,
  });

  await newCoupon.save();
  return newCoupon;
};

export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // dates will be formatted as YYYY-MM-DD
  return dates;
};
