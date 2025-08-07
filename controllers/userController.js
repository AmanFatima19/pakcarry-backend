const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "User already exist with this email, use another",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    // Welcome email bhejne ka logic yahan shuru hota hai
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Welcome to Our Platform!",
      html: `<p>Aapka bahut bahut shukriya, ${newUser.name}, hamari platform par register karne ke liye!</p>
             <p>Hum umeed karte hain aapko hamari services pasand aayengi.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Welcome email sending error:", error);
      } else {
        console.log("Welcome email sent:", info.response);
      }
    });
    // Welcome email bhejne ka logic yahan khatam hota hai

    const token = jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      msg: "user registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        msg: "user not found, please create account first",
      });
    }
    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!matchedPassword) {
      return res.status(400).json({
        msg: "Invalid email or password",
      });
    }

    // Login hone par naya professional email bhejne ka logic
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: existingUser.email,
      subject: "Successful Login to [Your App Name]",
      html: `
        <p>Hello ${existingUser.name},</p>
        <p>Aap ne abhi-abhi kamyabi se login kiya hai. Aap ab hamari services ko use kar sakte hain.</p>
        <p>Best regards,</p>
        <p>The [Your App Name] Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Login email sending error:", error);
      } else {
        console.log("Login email sent:", info.response);
      }
    });

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      msg: "user logged in successfully",
      token,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found with this email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Link",
      html: `
        <p>You requested a password reset. Click on the link to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error sending email" });
      }
      res.status(200).json({ msg: "Password reset email sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken } = req.params;
    const { newPassword } = req.body;

    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();

    res.status(200).json({ msg: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
