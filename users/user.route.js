const express = require("express");
const { UserModel } = require("./user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth.middleware");
const { BlacklistModel } = require("../middleware/Blacklist");

const userRouter = express.Router();


userRouter.post("/register", async (req, res) => {
    try {
        const { username, email, pass } = req.body;

        const existUser = await UserModel.findOne({ email })

        if (existUser) {
            res.status(400).send({ msg: "email is already register please login" })
        } else {
            bcrypt.hash(pass, 5, async (err, hash) => {
                if (err) {
                    return res.status(400).send({ error: err.message })
                }
                else {
                    const user = new UserModel({
                        username,
                        email,
                        pass: hash
                    });
                    await user.save();
                    return res.status(200).send({ msg: "new user has register successful", "new_user": user })
                }
            })
        }
    } catch (error) {
        res.status(400).send({ "error": error.message })
    }
});
userRouter.post("/login", async (req, res) => {
    try {
        const { email, pass } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(pass, user.pass, (err, result) => {
                if (result) {
                    const token = jwt.sign({ username: user.username, userId: user._id }, "token", { expiresIn: "1h" });
                    // res.cookie("token",token)
                    res.status(200).send({ msg: "user has been login successful!...", "token": token });
                }
            })
        }
    } catch (error) {
        res.status(400).send({ "error": error.message })

    }
});

userRouter.get("/logout",auth,async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const blacklistToken = new BlacklistModel({token});
        await blacklistToken.save();
        
        return res.status(200).send({msg:"user has been logout...."})
    } catch (error) {
        res.status(400).send({ "error": error.message })
        
    }
})
module.exports = { userRouter }