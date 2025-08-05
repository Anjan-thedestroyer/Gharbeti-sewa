import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coordinate: {
        lon: {
            type: String,
        },
        lat: {
            type: String,
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    room: {
        type: Number,
        default: 0,
    },
    contact_no: {
        type: Number,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Regex for 10-digit number
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        },
    },
    email: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    image: [{
        type: String
    }],
    buyer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buyer'
    }],
    Applicants: {
        type: Number,
        default: 0
    },
    menus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menu'
    }

}, { timestamps: true })
const HostelModel = mongoose.model("Hostel", HostelSchema);
export default HostelModel
HostelSchema.index({
    location: 'text',
    description: 'text',
    name: 'text'
});