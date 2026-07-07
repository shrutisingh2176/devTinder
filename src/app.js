
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require ("cookie-parser");
const cors = require("cors");
const http = require("http");


app.use(cors({
   origin : "http://localhost:5173",  // whitelist of allowed origins
   credentials: true,
}));
app.use(express.json());  // midddleware for reading json data and converting it into js object
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require ("./routes/profile");
const requestRouter = require ("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initializeSocket(server);

connectDB()
   .then(()=>{
    console.log("Database connection established...")

    server.listen(7777,()=> {
    console.log("Server is successfully listening!");
});

   })
   .catch((err) => {
    console.error("Databse cannot be connected!!");
   });

