import mongoose from "mongoose";

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"],
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Provide a valid email address"], // Email format validation
    },
    password: {
        type: String,
        required: [true, "Provide password"],
    },


    refresh_token: {
        type: String,
        default: "",
    },
    hostel: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "hostel"
    }],
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "freelance"
    },
    verify_email: {
        type: Boolean,
        default: false,
    },
    last_login_date: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active",
    },
    forgot_password_otp: {
        type: String,
        default: null,
    },
    forgot_password_expiry: {
        type: Date,
        default: null,
    },


    role: {
        type: String,
        enum: ["ADMIN", "USER", "Freelancer"],
        default: "USER",
    },
}, {
    timestamps: true,
});

// Create the User model
const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
