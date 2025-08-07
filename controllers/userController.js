const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { name, email, password ,role} = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "User already exist with this email, use another",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const register = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      role:role
    });
    const token = jwt.sign(
      {
        email: register.email,
        id: register._id,
        role:register.role
      },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      msg: "user registered successfully",
  token,
  user: {
    _id: register._id,
    name: register.name,
    email: register.email,
    role: register.role,
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
    role: existingUser.role
  }

    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};

module.exports = { register, login };