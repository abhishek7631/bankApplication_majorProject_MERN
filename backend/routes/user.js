const express = require("express");

const router = express.Router();

router.get("/balance", (req, res) => {
  res.status(200).json({ message: "This is get blance route" });
});

router.get("/notifications", (req, res) => {
  res.status(200).json({ message: "This is get notifications route" });
});

router.post("/notifications/toggle", (req, res) => {
  res.status(200).json({ message: "This is notifications toggle route" });
});

router.post("/change-password", (req, res) => {
  res.status(200).json({ message: "This is change password route" });
});

router.post("/change-pin", (req, res) => {
  res.status(200).json({ message: "This is change pin route" });
});

router.get("/users", (req, res) => {
  res.status(200).json({ message: "This is get all users route" });
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "This is logout route" });
});

module.exports = router;
