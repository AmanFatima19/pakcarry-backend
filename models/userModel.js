const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],  
    minLength: [8, "Password must have 8 characters minimum"],
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true }); 



const userModel = mongoose.model("user", UserSchema);

module.exports = userModel;