const express = require("express");
const {
  register,
  login, // Ye ab client login ke liye hai
  adminLogin, // Naya admin login function
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login); // Ab ismein sirf client login hoga
router.post("/admin-login", adminLogin); // Naya admin-specific login route
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetPasswordToken", resetPassword);

module.exports = router;
