
const mongoose = require('mongoose');

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
    },
    password: {
        type:String,
         required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        gender: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Not a valid gender (Male , Female and other)")
            }
        }
    },
    },
    about:{
        type:String,
        default:"This is default about the user !"
    },
    skills:{
        type:[String],
    },
    
    
}, {timestamps: true,});

// const userModel = mongoose.model("User",userSchema);
// module.exports = userModel;

module.exports = mongoose.model("User",userSchema);