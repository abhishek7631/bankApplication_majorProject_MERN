const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connect = require("./config/db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transaction");
const app = express();

dotenv.config();

connect();

const port = process.env.port;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
