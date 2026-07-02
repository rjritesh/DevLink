const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");

dns.setServers([
    '1.1.1.1',
    '8.8.8.8',
])
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




  app.post("/signup", (req, res)=>{
const user = new User ({
    firstName: "Ritesh",
    lastName: "jha",
    age: 22,
    gender: "M",
    emailId: "ritesh@gmail.com",

})
    
    res.send("User created successfully")
  })