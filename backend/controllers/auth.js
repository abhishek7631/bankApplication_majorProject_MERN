const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer"); // To send OTP via email
const crypto = require("crypto"); // To generate OTP
const sendEmail = require("../utils/resetEmail");
require("dotenv").config();

// Create a nodemailer transporter (adjust the settings for your email service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
}

// Register user (step 1 - send OTP)
exports.registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, transactionPin } = req.body;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password and transaction PIN
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(transactionPin, 10);

    // Generate OTP and expiration time
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Create the user (initially not verified)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      transactionPin: hashedPin,
      otp,
      otpExpires,
      isVerified: false,
    });

    // Email content and options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
};

// Verify OTP (step 2 - complete registration)
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is valid and not expired
    if (user.otp === otp && user.otpExpires > Date.now()) {
      // Set user as verified and clear OTP fields
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;

      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        message: "Registration successful",
      });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT token directly in the function
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        message: "Logged in successfully",
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).send("User not found");

  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken; // Store the token
  await user.save(); // Save the token

  // Create the reset link
  const resetUrl = `http://yourfrontend.com/reset-password/${resetToken}`;
  await sendEmail(
    email,
    "Password Reset",
    `Reset your password here: ${resetUrl}`
  );

  res.send("Reset link sent to your email");
};

// Step 2: Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body; // Get the new password from the request body

    // Check if the password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find the user by reset token
    const user = await User.findOne({ resetPasswordToken: req.params.token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password

    // Update the user's password and clear the reset token
    user.password = hashedPassword; // Store the new hashed password
    user.resetPasswordToken = undefined; // Clear the token
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error during password reset:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred during password reset" });
  }
};

exports.getMe = async (req, res) => {
  try {
    // Since the `protect` middleware adds the user to the request object
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data (without sensitive fields like password)
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
