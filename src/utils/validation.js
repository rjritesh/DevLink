const validator = require("validator")


const validateSignupData = (req)=>{
const { firstName, lastName, password, emailId} = req.body;
if(!firstName || !lastName){
    throw new Error ( "Name is invalid");
}
else if(firstName.length < 4 ){
    throw new Error ( "Name is invalid")
}
else if (!validator.isEmail(emailId)){
throw new Error ( "Email is invalid")
}
else if ( !validator.isStrongPassword(password)){
    throw new Error( " Please Enter a strong password ")
}
}   

module.exports= {
    validateSignupData
}