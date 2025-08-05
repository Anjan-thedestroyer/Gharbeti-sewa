import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Land"
    },
    expiry: {
        type: Date,
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "freelance"
    }],
    isAccepted: {
        type: Boolean,
        default: false
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "freelance",
    },
    isCompleted: {
        type: Boolean,
        default: false
    },


}, {
    timestamps: true
});

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel;
