// for /user routes

const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWTSecretKey = require("../config");
const User = require("../db");

const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    // zod validation
    const {success} = signupSchema.safeParse(body);
    if (!success){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }
    const existingUser = User.findOne({
        username: body.username
    })

    if(existingUser){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
        return;
    }

    // make new user if not already existing
    const newUser = await User.create({
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password
    });

    const userId = newUser.username
    const token = jwt.sign({
        userId
    }, JWTSecretKey)

    res.status(200).json({
        message: "User created successfully",
        token: token
    });

});

module.exports = router;