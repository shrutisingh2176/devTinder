
const express = require("express");
const app = express();


app.get("/getUserData" ,(req,res) =>{
try{  throw new Error ("xyz");
   res.send("User Data Sent");
}
catch{ res.status(500).send("Error Contact Team Support");}
   
});

app.use("/",(err,req,res,next) => {
if (err) {
    //log your errors also 
    res.status(500).send("something went wrong");
}
});


app.listen(7777,()=> {
    console.log("Server is successfully listening!");
});