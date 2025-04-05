const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" // By default, every new user is a regular user
    },
    cartData: {
        type: Object,
        default: {}
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
