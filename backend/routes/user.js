const express = require("express");
const {
  getUserBalance,
  getNotifications,
  toggleNotifications,
  chnagePassword,
  changeTransactionPin,
  getAllUsers,
  logout,
} = require("../controllers/user");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/balance", protect, getUserBalance);

router.get("/notifications", protect, getNotifications);

router.post("/notifications/toggle", protect, toggleNotifications);

router.post("/change-password", protect, chnagePassword);

router.post("/change-pin", protect, changeTransactionPin);

router.get("/users", protect, getAllUsers);

router.post("/logout", protect, logout);

module.exports = router;
