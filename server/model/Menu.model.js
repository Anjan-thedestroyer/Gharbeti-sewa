import mongoose, { Mongoose } from "mongoose";

const MenuSchema = new mongoose.Schema({
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hostel'
    },
    days: {
        Sunday: {
            type: String
        },
        Monday: {
            type: String
        },
        tuesday: {
            type: String
        },
        Wednesday: {
            type: String
        },
        Thursday: {
            type: String
        },
        Friday: {
            type: String
        },
        Saturday: {
            type: String
        }
    }
})
const MenuModel = mongoose.model("menu", MenuSchema)

export default MenuModel;