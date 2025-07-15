import mongoose from "mongoose";

const LandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },

        coordinate: {
            lon: {
                type: String,
            },
            lat: {
                type: String,
            }
        },
        Contact_no1: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid 10-digit phone number!`
            },
        },
        Contact_no2: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid 10-digit phone number!`
            },
        },
        pricing: {
            type: Number,
            default: 1000,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        Applicants: {
            type: Number,
            default: 0
        },
        Applicants_details: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buyer'
        }],
        length: {
            type: Number,
        },
        width: {
            type: Number,
        },
        room: {
            type: Number,
            default: 0,
        },
        washroom: {
            type: Number,
            default: 0,
        },
        bathroom: {
            type: Number,
            default: 0,
        },
        image: [{
            type: String,
        }],
        description: {
            type: String,
            default: "",
        },
        sold: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

LandSchema.index({
    location: 'text',

    description: 'text',
    name: 'text'
});

const LandModel = mongoose.model("Land", LandSchema);
export default LandModel;
