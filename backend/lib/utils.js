import { redis } from "./redis.js";
import Product from "../models/product.model.js";
import crypto from "crypto";
import { stripe } from "./stripe.js";
import jwt from "jsonwebtoken";

export const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in updating featured products cache:", error.message);
  }
};
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

// TODO: Update HTML email template to look more professional (with more on-brand theming + footer)
export const preparePurchaseSuccessEmail = (email, name, orderDetails) => {
  const BASE_URL = process.env.CLIENT_URL || "http://localhost:5000";

  // Generate product list HTML
  const productListHTML = orderDetails.products
    .map(
      (product) => `
    <tr style="border-bottom: 1px solid #e9d5ff;">
      <td style="padding: 12px; text-align: left;">${product.name}</td>
      <td style="padding: 12px; text-align: center;">${product.quantity}</td>
      <td style="padding: 12px; text-align: right;">$${product.price.toFixed(
        2
      )}</td>
      <td style="padding: 12px; text-align: right;">$${(
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
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: #f8f6fc;">
        <h1 style="color: #7c3aed; text-align: center;">Order Confirmed!</h1>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for your purchase! Your order has been confirmed and is being processed.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(124, 58, 237, 0.1);">
          <h2 style="color: #7c3aed; margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderDetails.id}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(124, 58, 237, 0.1);">
          <h3 style="color: #7c3aed; margin-top: 0;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #7c3aed; color: white;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productListHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #7c3aed;">
            <p style="text-align: right; font-size: 18px; font-weight: bold; color: #7c3aed; margin: 0;">
              Total Amount: $${orderDetails.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9d5ff;">
        <p style="color: #a78bfa; font-size: 12px;">
          Questions about your order? Contact us at support@storeyourneeds.com<br>
          &copy; ${new Date().getFullYear()} Store Your Needs. All rights reserved.
        </p>
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
