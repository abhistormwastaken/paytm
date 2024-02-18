import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://abhiwastaken:abhiwastaken@cluster0.zgdntvd.mongodb.net/paytm")

//schema for paytm db
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;