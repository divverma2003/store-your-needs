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
