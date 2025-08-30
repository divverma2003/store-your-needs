import nodemailer from "nodemailer";

// User registers → Account created but unverified → Email sent → User clicks link → Account verified → Can login
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Email transporter error:", error.message);
  } else {
    console.log("Email server is ready to send our messages.");
  }
});

export default transporter;
