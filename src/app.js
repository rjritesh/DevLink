const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");
const User = require("./models/user");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();
app.use(express.json());

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
    const user = new User(req.body);

    await user.save();

    res.send("User added to db successfully");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.get("/user", async (req, res) => {
  
    const userEmail = req.body.emailId;
  try {
   const user =  await User.find({ emailId :userEmail});
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong..");
  }
});
