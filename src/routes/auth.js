const express = require ("express");
const authRouter = express.Router(); 
const User = require("../models/user");
const {validateSignupData}= require ("../utils/validation");
const bcrypt = require("bcrypt");
//app.use = router.use 

authRouter.post("/signup", async (req,res)=>{
try{
    //Validation of data 
    validateSignupData(req);
    const {firstName,lastName,emailId,password,gender}= req.body
    
    //Encrypt the password 
     const passwordHash = await bcrypt.hash(password, 10)


//Creating new instance of the user model
const user = new User ({
    firstName,
    lastName,
    emailId,
    password:passwordHash,
    gender,
} );


await user.save();
res.send("User Added Successfully!!");
} catch(err){
    res.status(400).send("ERROR:  " + err.message);
};
});

authRouter.post("/login" , async (req,res) =>{
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
});


authRouter.post ("/logout",async(req,res) =>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),

    });
    res.send("Logout Successfull!!!");
});



module.exports= authRouter; 