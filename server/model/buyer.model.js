import mongoose from 'mongoose'

export const BuyerSchema = new mongoose.Schema({
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
    No_of_people: {
        type: Number,
        required: true

    },
    No_of_rooms: {
        type: Number,
        required: true

    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
    },
    rent_room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Land',
    },
    completed: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true })

const BuyerModel = mongoose.model('buyer', BuyerSchema)

export default BuyerModel;
