const mongoose= require("mongoose");

const  connectDB = async() => {
    await mongoose.connect("mongodb+srv://namastedev:yE83G9RGQR5uaL8w@namastenode.rng13sx.mongodb.net/devTinder"
   )};

   module.exports= connectDB;

   