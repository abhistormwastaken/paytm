// for /user routes

const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWTSecretKey = require("../config");
const { User, Account } = require("../db");

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    // zod validation
    const {success} = signupBody.safeParse(body);
    if (!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    const existingUser = await User.findOne({
        username: body.username
    })

    if(existingUser){
        return res.status(411).json({
            message: "Email already taken"
        });
    }

    // make new user if not already existing
    const user = await User.create({
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password
    })

    const userId = user._id;

    // create account and give random balance to user
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    
    const token = jwt.sign({
        userId
    }, JWTSecretKey)

    res.status(200).json({
        message: "User created successfully",
        token: token
    });

});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinBody.safeParse(body);
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
            userId: user._id
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

const { authMiddleware } = require("../middleware");

const updateSchema = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional()
});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Error while updating information"
        });
    }
    // find and update user information with req.body
    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
        message: "Updated successfully"
    });
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        // $or is for filtering by multiple conditions
        $or: [{ 
            // filter by first name or last name
            // options: i is for case insensitive
            firstName: { $regex: filter, $options: "i" },
            lastName: { $regex: filter, $options: "i" } 
        }]
    })
    res.json({
        user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
    })
})

module.exports = router;