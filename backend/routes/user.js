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

const router = express.Router();

router.get("/balance", getUserBalance);

router.get("/notifications", getNotifications);

router.post("/notifications/toggle", toggleNotifications);

router.post("/change-password", chnagePassword);

router.post("/change-pin", changeTransactionPin);

router.get("/users", getAllUsers);

router.post("/logout", logout);

module.exports = router;
