const User = require("../models/user");
const bcrypt = require("bcrypt");
const Notification = require("../models/notification");

exports.getUserBalance = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });
    res.status(200).json({ message: user.balance });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.getNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user.notificationsEnabled) {
      return res.status(400).json({
        message: "Notification are disabled",
        notificationsEnabled: false,
      });
    }

    const notifications = await Notification.find({ user: userId }).sort({
      date: -1,
    });

    return res.status(200).json({ notifications, notificationsEnabled: true });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(400).json({ message: "server error" });
  }
};

exports.toggleNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);

    user.notificationsEnabled = !user.notificationsEnabled;

    await user.save();

    res.status(200).json({
      message: `Notifications have been ${
        user.notificationsEnabled ? "enabled" : "disabled"
      }`,
      notificationsEnabled: user.notificationsEnabled,
    });
  } catch (error) {
    console.error("Error toggling notifications:", error);
    res.status(400).json({ message: "server error" });
  }
};

//change password

exports.chnagePassword = async (req, res) => {
  const { currentPassword, newPassowrd, confirmPassword } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "current password is incorrect" });

    if (newPassowrd !== confirmPassword)
      return res.status(400).json({ message: "New password do not match" });

    const hashPassword = await bcrypt.hash(newPassowrd, 10);

    user.password = hashPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Change Transaction pin

exports.changeTransactionPin = async (req, res) => {
  const { currentPin, newPin, confirmPin } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(currentPin, user.transactionPin);

    if (!isMatch)
      return res.status(400).json({ message: "Current pin is incorrect" });

    if (newPin !== currentPin)
      return res.status(400).json({ message: "New pins do not match" });

    const hashPin = bcrypt.hash(newPin, 10);

    user.transactionPin = hashPin;

    await user.save();

    res.status(200).json({ message: "Transaction pin changed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all users except the current user
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.find({ _id: { $ne: currentUserId } }, "name _id");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout
exports.logout = async (req, res) => {
  req.user = null;
  res.json({ message: "Logged out successfully" });
};
