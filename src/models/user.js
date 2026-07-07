const mongoose = require("mongoose");
const validator = require("validator");
const userschema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new error("Invalid email")
        }
      }
    },
    password: {
      type: String,
      required: true,
      minLength:8,
    },
    gender: {
      type: String,
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userschema);
