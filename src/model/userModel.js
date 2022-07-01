const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        trim: true,
        required: true,
        enum: ["Admin", "User", "Guest"]
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    address: {
        street: { type: String, required: true },
        place: { type: String, required: true },
        pincode: { type: Number, required: true }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)