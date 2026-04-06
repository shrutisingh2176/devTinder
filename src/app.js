
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());  // midddleware for reading json data and converting it into js object

app.post("/signup", async (req,res)=>{
console.log(req.body);
//Creating new instance of the user model
const user = new User ( req.body);

try{
await user.save();
res.send("User Added Successfully!!");
} catch(err){
    res.status(400).send("Error saving the user " + err.message);
};
});


connectDB()
   .then(()=>{
    console.log("Database connection established...")

    app.listen(7777,()=> {
    console.log("Server is successfully listening!");
});

   })
   .catch((err) => {
    console.error("Databse cannot be connected!!");
   });

