
const express = require("express");
const app = express();

app.use(
    "/user",
    (req,res,next) => {
        console.log("Handling the route user!!");
        res.send("response!!")
        next();
    },
(req,res,next) => {
    console.log("Handling the route user 2 !");
    res.send("2nd response!!");
    next();
},
(req,res,next) => {
    console.log("Handling the route user 3 !");
    res.send("3rd response!!");
    next();
},
(req,res,next) => {
    console.log("Handling the route user 4 !");
    res.send("4th response!!");
    
}
);


app.listen(7777,()=> {
    console.log("Server is successfully listening!");
});