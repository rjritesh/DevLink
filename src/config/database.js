const mongoose = require("mongoose");


const connectDB = async ()=>{
   await mongoose.connect("mongodb+srv://riteshDev:2Gi92nbmkNkMc3As@namastenode.xwcial4.mongodb.net/")
};


module.exports = connectDB;