const express = require("express");
const { connection } = require("./connection/connection");
const { userRouter } = require("./users/user.route");
const { noteRouter } = require("./notes/note.route");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/users",userRouter)
app.use("/notes",noteRouter)

app.listen(8080,async()=>{
    try {
        await connection;
        console.log("server is connected to database");
        console.log("server is running at port 8080");
    } catch (error) {
        console.log(error)
    }
})