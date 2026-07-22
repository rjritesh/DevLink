// ===============================
// Required Packages aur Modules Import Kar Rahe Hain
// ===============================

const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");


// ===============================
// DNS Server Set Kar Rahe Hain
// Taaki Internet Name Resolution Fast aur Reliable Ho
// ===============================
dns.setServers(["1.1.1.1", "8.8.8.8"]);


// ===============================
// Express Application Create Kar Rahe Hain
// ===============================
const app = express();


// ===============================
// Middleware
// express.json() -> Incoming JSON Data ko req.body me Convert Karega
// cookieParser() -> Client ki Cookies Read Karne Ke Liye
// ===============================
app.use(express.json());
app.use(cookieParser());


// ===============================
// Sabse Pehle MongoDB Se Connection Banega
// Agar Connection Successful Hua Tabhi Server Start Hoga
// ===============================
connectDB()
  .then(() => {
    console.log("Database connected successfully");

    // Server Port 7777 Par Listen Karega
    app.listen(7777, () => {
      console.log("Server is running fine on 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });



// ==========================================================
// SIGNUP API
// Naya User Register Karne Ke Liye
// ==========================================================
app.post("/signup", async (req, res) => {
  try {

    // Client Se Data Nikal Rahe Hain
    const { firstName, lastName, password, emailId } = req.body;


    // Signup Data Validate Kar Rahe Hain
    validateSignupData(req);


    // Password Ko Hash (Encrypt) Kar Rahe Hain
    // Original Password Kabhi Database Me Store Nahi Hota
    const hashPassword = await bcrypt.hash(password, 10);

    console.log(hashPassword);


    // User Model Ka Naya Object Bana Rahe Hain
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });


    // User Ko MongoDB Me Save Kar Rahe Hain
    await user.save();

    res.send("User added to db successfully");

  } catch (error) {

    console.error(error);

    // Agar Koi Error Aaye To Client Ko Error Message Bhej Do
    res.status(400).send(error.message);
  }
});



// ==========================================================
// LOGIN API
// Existing User Ko Login Karne Ke Liye
// ==========================================================
app.post("/login", async (req, res) => {
  try {

    // Login Credentials Le Rahe Hain
    const { emailId, password } = req.body;


    // Email Se User Ko Database Me Search Kar Rahe Hain
    const user = await User.findOne({ emailId: emailId });


    // Agar User Nahi Mila To Error Throw Kar Do
    if (!user) {
      throw new Error("Invalid credentials");
    }


    // User Ke Enter Kiye Password Ko
    // Database Ke Hashed Password Se Compare Kar Rahe Hain
    const isPasswordValid = await bcrypt.compare(password, user.password);


    // Agar Password Match Ho Gaya
    if (isPasswordValid) {

      // JWT Token Generate Kar Rahe Hain
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secretkey@2026",
      );


      // Token Ko Cookie Me Store Kar Rahe Hain
      res.cookie("token", token);

      res.send("Login successfull");

    } else {

      // Password Match Nahi Hua
      throw new Error("Invalid credentials");
    }

  } catch (error) {

    res.status(400).send("Error: " + error.message);
  }
});



// ==========================================================
// SINGLE USER FETCH API
// Email Ke Basis Par User Ko Fetch Karna
// ==========================================================
app.get("/user", async (req, res) => {

  // Request Body Se Email Le Rahe Hain
  const userEmail = req.body.emailId;

  try {

    // Matching Email Wale User Ko Database Se Fetch Kar Rahe Hain
    const user = await User.find({ emailId: userEmail });

    res.send(user);

  } catch (error) {

    res.status(400).send("Something went wrong..");
  }
});




// ==========================================================
// FEED API
// Database Ke Sare Users Fetch Karne Ke Liye
// ==========================================================
app.get("/feed", async (req, res) => {

  try {

    const user = await User.find({});

    res.send(user);

  } catch (error) {

    res.status(400).send("Something went wrong");
  }
});




// ==========================================================
// DELETE USER API
// UserId Ke Basis Par User Delete Karna
// ==========================================================
app.delete("/user", async (req, res) => {

  // Client Se UserId Le Rahe Hain
  const userId = req.body.userId;

  try {

    // Database Se User Delete Kar Rahe Hain
    await User.findByIdAndDelete(userId);

    res.send("user deleted successfully");

  } catch (error) {

    res.status(400).send("Someting wrong");
  }
});




// ==========================================================
// UPDATE USER API
// Sirf Kuch Selected Fields Hi Update Hone Denge
// ==========================================================
app.patch("/user/:id", async (req, res) => {

  // URL Parameter Se UserId Le Rahe Hain
  const userId = req.params.id;

  // Client Se Update Data Le Rahe Hain
  const data = req.body;

  try {

    // Ye Fields Hi Update Karne Ki Permission Hai
    const allowedUpdates = [
      "photoUrl",
      "gender",
      "about",
      "skills",
    ];


    // Check Kar Rahe Hain Ki Client Sirf Allowed Fields Hi Bhej Raha Hai Ya Nahi
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );


    // Agar Invalid Field Aayi To Error Throw Kar Do
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!!");
    }


    // Maximum 10 Skills Hi Allow Kar Rahe Hain
    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills can not be more than 10");
    }


    // User Ko Update Kar Rahe Hain
    // runValidators:true -> Schema Validation Dobara Run Hogi
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    res.send("User updated successfully");

  } catch (error) {

    res.status(400).send(error.message);
  }
});