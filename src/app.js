
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const {validateSignupData}= require ("./utils/validation");
const bycrpt = require("bcrypt");
app.use(express.json());  // midddleware for reading json data and converting it into js object


app.post("/signup", async (req,res)=>{
try{
    //Validation of data 
    validateSignupData(req);
    const {firstName,lastName,emailId,password}= req.body
    
    //Encrypt the password 
     const passwordHash = await bycrpt.hash(password, 10)


//Creating new instance of the user model
const user = new User ({
    firstName,
    lastName,
    emailId,
    password:passwordHash,
} );


await user.save();
res.send("User Added Successfully!!");
} catch(err){
    res.status(400).send("ERROR:  " + err.message);
};
});

app.post("/login" , async (req,res) =>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailIdId: emailId});
        if (!user){
            throw new Error ("Invalid Credentials" );
        
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.send("Login Successfull!!");
        } else {
            throw new Error ("Invalid Credentials");
        } 
        }catch (err) {
            res.status(400).send("ERROR: " + err.message);
    }
})

// Get user by email
app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId;
    try{
    const users =await User.findOne({emailId: userEmail})
    
        if(users.length ===0){
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    }
    catch(err) {
        res.status(400).send("Something went wrong !!")
    }

})


//Feed API - GET  /feed -get all the users from the database 
app.get("/feed", async (req,res) => {
    try{
            const users = await User.find({});
            if(users.length===0){
                res.send("No user found!!")
            } else {
                console.log(users);
                res.send(users);
            }
       }
     catch (err) {
        res.status(400).send("Something went wrong !!")
     }
});


//delete user API - deleting a user by its id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const users = await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully")

    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// patch user API - updating the data of user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    

    try {
        
        const ALLOWED_UPDATES = [
          "photoURL",
          "about",
          "gender",
          "skills",
          "firstName",
          "lastName",
          "age"
      ];
         const isUpdateAllowed = Object.keys(data).every((k) =>
         ALLOWED_UPDATES.includes(k));
      
       if (!isUpdateAllowed) {
          throw new Error("Update Not Allowed")
      }

      if(data.skills.length>10) {
        throw new Error ("Skills more than 10 not allowed!!!") 
      }

        const user = await User.findByIdAndUpdate({ _id: userId }, data,{
             returnDocument: "after",
             runValidators:true,

         });
        console.log(user)
        res.send("User updated successfully");

    } catch (err) {
        res.status(400).send("UPDATE FAILED: "+ err.message);
    }
})

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

