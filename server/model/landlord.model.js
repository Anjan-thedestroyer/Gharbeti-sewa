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
        shutter: {
            type: String
        },
        price: {
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
LandSchema.pre('save', function (next) {
    if (this.isModified('location.raw')) {
        this.location.normalized = this.location.raw
            .split(',')
            .map(part => part.trim())
            .join(', ');

        this.location.primary = this.location.raw
            .split(',')
            .map(part => part.trim())
            .filter(part => {
                const lowerPart = part.toLowerCase();
                return part &&
                    !/^\d+$/.test(part) &&
                    !['nepal', 'नेपाल'].includes(lowerPart);
            })
            .slice(0, 2)
            .join(', ');
    }

    if (this.isModified('dimensions')) {
        if (this.dimensions.length && this.dimensions.width) {
            this.dimensions.area = this.dimensions.length * this.dimensions.width;
        }
    }

    next();
});

LandSchema.index({
    'location.normalized': 'text',
    'location.primary': 'text',
    description: 'text',
    name: 'text'
});
LandSchema.index({ location: "text", name: "text", description: "text" });

LandSchema.index({
    'coordinate.lon': 1,
    'coordinate.lat': 1
});

const LandModel = mongoose.model("Land", LandSchema);
export default LandModel;
