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



//get the single user from API
app.get("/user", async (req, res) => {
  
  const userEmail = req.body.emailId;
  try {
   const user =  await User.find({ emailId :userEmail});
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong..");
  }
});



//get all the feeds from api
app.get("/feed", async (req, res)=>{

  try{
    const user = await User.find({});
    res.send(user)
  }
  catch(error){
    res.status(400).send("Something went wrong")
  }
})



app.delete("/user", async(req, res)=>{
  const userId = req.body.userId;

  try{
const user = await User.findByIdAndDelete(userId);
res.send("user deleted successfully")
  }
  catch(error){
res.status(400).send("Someting wrong")
  }
})

app.patch("/user", async (req, res)=>{
  const userId = req.body.userId;
  const data = req.body.data;

  try{
await User.findByIdAndUpdate(userId, data)
res.send("User updated successfully")
  }
  catch(error){
res.status(401).send("Something went wrong")
  }
})