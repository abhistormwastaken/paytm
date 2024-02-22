import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://abhiwastaken:abhiwastaken@cluster0.zgdntvd.mongodb.net/paytm")

// schema for paytm db
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// schema for paytm account
const accountSchema = new Mongoose.Schema({
    username: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true }
})

const Account = mongoose.model("Account", accountSchema)

module.exports = {
    User,
    Account
};