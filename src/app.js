
const express = require("express");
const app = express();

app.get("/admin/getAllData",(req,res) => {
    //Logic of checking if the request is authorised
    const token ="xyz";
    const isAdminAuthorised= token ==="xyz";
    if (isAdminAuthorised) {
        res.send("All data Sent");
    } else{
        res.status(401).send("Unauthorized request");
    }
    });

    app.get("/admin/deleteUser", (req,res)=>{
        //Logic of checking if the request is authorised 
        res.send("Deleted a user");
    });


app.listen(7777,()=> {
    console.log("Server is successfully listening!");
});