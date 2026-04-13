
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const {validateSignupData}= require ("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require ("cookie-parser");
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/auth");
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
         const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

         const token = await user.getJWT();
         
          

            res.cookie("token", token);
            res.send("Login Successfull")

           
        } else {
            throw new Error ("Invalid Credentials");
        } 
        }catch (err) {
            res.status(400).send("ERROR: " + err.message);
    }
})


app.get("/profile", userAuth, async (req,res) => {

try{ 
    // const cookies = req.cookies;

    // const {token} = cookies;
    // if (!token) {
    //         throw new Error("Not a Vaid token !!")
    //     }

    //Validate my token 

    // const deocodedMessage = await jwt.verify(token, "999@Akshad")
    // const { _id } = deocodedMessage;


    // 
    const user = req.user;
        res.send(user);
   
} catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
});

app.post("/sendConnectionRequest", userAuth,async (req,res) =>{
// Sending a connection request 
const user = req.user;
console.log("Sending a connection request ");
res.send( user.firstName+ "sent the connection request!");
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

