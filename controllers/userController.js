const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // For generating secure tokens
const nodemailer = require("nodemailer"); // For sending emails

// Nodemailer transporter setup (reusing from server.js)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Environment variable
    pass: process.env.EMAIL_PASS, // Environment variable
  },
});

// Dummy function to create a JWT token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = "amanfatima713@gmail.com";
  const ADMIN_PASSWORD = "AmanFatima09";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const mockAdminUser = {
      _id: "admin123",
      name: "Admin User",
      email: ADMIN_EMAIL,
      role: "admin",
    };
    const token = createToken(mockAdminUser._id, mockAdminUser.role);
    res.status(200).json({
      msg: "Admin Logged In Successfully",
      token,
      user: mockAdminUser,
    });
  } else {
    res.status(401).json({ msg: "Invalid admin credentials" });
  }
};

// Normal user login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role);

    res.status(200).json({ msg: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Registration
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Working Forgot Password functionality
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found with that email." });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save the hashed token and expiry in the database
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Create a password reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0ac6ae;">Password Reset Request</h2>
          <p>Dear ${user.name},</p>
          <p>You have requested to reset your password. Please click on the link below to reset your password. This link is valid for one hour.</p>
          <a href="${resetUrl}" style="background-color: #0ac6ae; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      msg: "Password reset link sent to your email.",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();
    console.error("Error sending password reset email:", error);
    res.status(500).json({
      msg: "Error sending email. Please try again.",
    });
  }
};

// Working Reset Password functionality
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.resetPasswordToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Password reset token is invalid or has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ msg: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ msg: "Server error during password reset." });
  }
};

module.exports = {
  adminLogin,
  login,
  register,
  forgotPassword,
  resetPassword,
};
