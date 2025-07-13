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

    mobile: {
        type: Number,
        default: null,
        validate: {
            validator: function (v) {
                return /^\d{10,15}$/.test(v); // Validates mobile number (10-15 digits)
            },
            message: "Provide a valid mobile number",
        },
    },
    refresh_token: {
        type: String,
        default: "",
    },
    hostel: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "hostel"
    }],
    verify_email: {
        type: Boolean,
        default: false,
    },
    last_login_date: {
        type: Date,
        default: null, // Changed from empty string to null
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
        default: null, // Changed from empty string to null
    },

    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the User model
const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
