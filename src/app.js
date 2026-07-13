const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");
const User = require("./models/user");

const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();
app.use(express.json());

///database connection
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

////post api

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, password, emailId } = req.body;

    //validation of data
    validateSignupData(req);

    //Encrytpion of the password

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    //Creating a new instace of the User modal

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();

    res.send("User added to db successfully");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    const isPasswordValid =await bcrypt.compare(password, user.password);
    if(isPasswordValid){
      res.send("Login successfull")
    }
    else{
      throw new Error ( "invalid credentials")
    }

  } catch (error) {
    res.status(400).send(error.message)
  }
});

//get the single user from API
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong..");
  }
});

//get all the feeds from api
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//delete api/
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (error) {
    res.status(400).send("Someting wrong");
  }
});

////update api

app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body; // Agar Postman me data object bhej rahe ho
  try {
    const allowedUpdates = ["photoUrl", "gender", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!!");
    }

    if (data.skills && data?.skills.length > 10) {
      throw new Error("Skills can not be more than 10");
    }

    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
