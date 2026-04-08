
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const {validateSignupData}= require ("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require ("cookie-parser");
const jwt = require("jsonwebtoken")
app.use(express.json());  // midddleware for reading json data and converting it into js object
app.use(cookieParser());

app.post("/signup", async (req,res)=>{
try{
    //Validation of data 
    validateSignupData(req);
    const {firstName,lastName,emailId,password}= req.body
    
    //Encrypt the password 
     const passwordHash = await bcrypt.hash(password, 10)


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
        const user = await User.findOne({emailId: emailId});


        if (!user){
            throw new Error ("Invalid Email" );
        }
         const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {

            //Create JWT Token

             //create a jwt token
         const token = await jwt.sign({ _id: user._id }, "999@Akshad");
         
            //Add the token to cookies and send the response back to the user 

            res.cookie("token", token);
            res.send("Login Successfull")

            res.send("Login Successfull!!");
        } else {
            throw new Error ("Invalid Credentials");
        } 
        }catch (err) {
            res.status(400).send("ERROR: " + err.message);
    }
})


app.get("/profile", async (req,res) => {

try{ const cookies = req.cookies;

    const {token} = cookies;
    if (!token) {
            throw new Error("Not a Vaid token !!")
        }

    //Validate my token 

    const deocodedMessage = await jwt.verify(token, "999@Akshad")
    const { _id } = deocodedMessage;


    const user = await User.findById(_id);
        if (!user) {
            throw new Error("User Not Found")
        }
        
    console.log("Logged In User is: "  + _id);

    res.send("Reading Cookie");
} catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
});

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

