const express = require("express");
const dotenv = require("dotenv");
const connect = require("./config/db");
const userroutes = require("./routes/user");
const app = express();

dotenv.config();

connect();

const port = process.env.port;

app.use(express.json());

app.use("/api/user", userroutes);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
