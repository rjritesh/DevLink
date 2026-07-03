const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");
const User = require("./models/user");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(7777, () => {
      console.log("Server is running fine on 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.post("/signup", async (req, res) => {
  try {
    const user = new User({
      firstName: "Ritesh",
      lastName: "Jha",
      age: 22,
      gender: "M",
      emailId: "ritesh@gmail.com",
    });

    await user.save();

    res.send("User added to db successfully");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});