
const express = require("express");
const app = express();

//This will only handle GET call to /user
app.get("/user",(req,res) => {
    res.send({ firstName: "Shruti", lastName:"Singh"});
});

app.post("/user", async(req,res) =>{
    //saving data to DB 
    res.send("Data successfully saved")
});

app.delete("/user",(req,res)=>{
    res.send("Deleted successfully")
})

app.use("/test",(req,res)=>{
    res.send("hello from the server!");
});





app.listen(7777,()=> {
    console.log("Server is successfully listening!");
});