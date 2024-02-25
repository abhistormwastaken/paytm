const mongoose = require("mongoose");
const db_connection_string = import.meta.env.MONGODB_CONNECTION_STRING;

mongoose.connect(db_connection_string)

// schema for paytm db
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// schema for paytm account
const accountSchema = new mongoose.Schema({
    // to prevent making balances for non-existing users, we use mongoose.Schema.Types.ObjectId with ref to our User table
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true }
})

const Account = mongoose.model("Account", accountSchema)

module.exports = {
    User,
    Account
};