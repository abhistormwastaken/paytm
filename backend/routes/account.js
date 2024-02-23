// for /account routes
const express = require("express");
const router = express.Router();
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })
    return res.status(200).json({
        balance: account.balance
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    // we need to create a session for transactions and rollback if any of the transactions fail
    // eg when without-session code will fail is when you try to transfer money to 2 people at the same time, this will fool the balance check as it will check the balance before the transaction completes and your db balance would not have updated before the concurrent request

    // create a session
    const session = await mongoose.startSession();
    session.startTransaction();

    const { to, amount } = req.body;
    const account = await Account.findOne({
        userId: req.userId
    })
    if(account.balance < amount){
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
    // commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
        message: "Transfer successful"
    });
})

module.exports = router;