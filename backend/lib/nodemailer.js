import nodemailer from "nodemailer";

let transporter = null;

// TODO: Fix the dependency problems with env
// Create transporter lazily when needed
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
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
  }
  return transporter;
};

export default getTransporter;
