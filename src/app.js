const express = require("express")
const app = express();

app.use("/",(req, res)=>{
   res.send("heluu from node.js")
})


app.listen(7777, ()=>{
    console.log('Server is running fine on 7777')
})