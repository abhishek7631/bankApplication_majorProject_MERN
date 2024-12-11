const mongoose = require("mongoose");

const connect = () =>
  mongoose
    .connect("mongodb://localhost:27017/bankApplication")
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => {
      console.log(err);
    });

module.exports = connect;
