const express = require("express");
const dotenv = require("dotenv");
const connect = require("./config/db");
const app = express();

dotenv.config();

connect();

const port = process.env.port;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
