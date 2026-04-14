
const mongoose = require('mongoose');
const validator = require ("validator");
const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
         unique:true,
         required:true,
         lowercase:true,
         trim:true,
        validate(value) {
        if (!validator.isEmail(value)) {
            throw new Error("Invalid Email :" + value)
        }
        }
    },
    password: {
        type:String,
         required:true,
            validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password :" + value)
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
     gender: {
        type: String,
        enum:{
            values:["male", "female", "others"],
            message: `{VALUE} is not valid gender type`
        },
        required: true,
        trim: true,

        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Not a valid gender (Male , Female and other)")
        //     }
        },
    
    
    photoUrl:{
     type:String,
     default:"https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL :" + value)
            }
        }
    },

    about:{
        type:String,
        default:"This is default about the user !"
    },
    skills:{
        type:[String],
    },
    
    
}, {timestamps: true,});

// for jwt
// arrow function will not work here with this.
    userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: this._id }, "999@Akshad", { expiresIn: "7d" })

    return token;
};
 
// for password validation

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;

}

// const userModel = mongoose.model("User",userSchema);
// module.exports = userModel;

module.exports = mongoose.model("User",userSchema);