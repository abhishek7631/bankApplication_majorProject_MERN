const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionDetails,
} = require("../controllers/transaction");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createTransaction);

router.get("/", protect, getTransactions);

router.get("/transactions/:transactionId", protect, getTransactionDetails);

module.exports = router;
