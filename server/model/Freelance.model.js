import mongoose from "mongoose";

const freelanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    task: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]

}, {
    timestamps: true
});

const freelanceModel = mongoose.model("freelance", freelanceSchema);
export default freelanceModel;
freelanceSchema.index({ location: 'text' });

