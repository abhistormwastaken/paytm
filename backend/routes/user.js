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
            message: "Incorrect inputs"
        });
    }
    const existingUser = User.findOne({
        username: body.username
    })

    if(existingUser){
        res.status(411).json({
            message: "Email already taken"
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

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(body);
    if (!success){
        res.status(411).json({
            message: "Incorrect inputs"
        });
        return
    }

    // return token if user exists
    const user = await User.findOne({
        username: body.username,
        password: body.password
    });
    // returning token as response
    if(user){
        const token = jwt.sign({
            userId: user.username
        }, JWTSecretKey);
        res.status(200).json({
            token: token
        });
    }
    else{
        res.status(411).json({
            message: "Error while logging in"
        });
    }
})

module.exports = router;