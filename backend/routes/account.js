// for /account routes
const express = require("express");
const router = express.Router();
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })
    res.status(200).json({
        balance: account.balance
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;
    const account = await Account.findOne({
        userId: req.userId
    })
    if(account.balance < req.body.amount){
        res.status(400).json({
            message: "Insufficient balance"
        });
        return
    }
    const toAccount = await Account.findOne({
        userId: to
    })
    if(!toAccount){
        res.status(400).json({
            message: "Invalid account"
        });
        return
    }
    // find account and increment balance using $inc
    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    })
    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    })
    res.status(200).json({
        message: "Transfer successful"
    });
})

module.exports = router;