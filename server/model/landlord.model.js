import mongoose from "mongoose";

const LandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        // Structured location
        location: {
            type: String, required: true

        },

        // Coordinates for geospatial queries
        coordinate: {
            lon: { type: Number },
            lat: { type: Number }
        },

        Contact_no1: {
            type: String,
            validate: {
                validator: v => /^\d{10}$/.test(v),
                message: props => `${props.value} is not a valid 10-digit phone number!`
            },
        },
        Contact_no2: {
            type: String,
            validate: {
                validator: v => /^\d{10}$/.test(v),
                message: props => `${props.value} is not a valid 10-digit phone number!`
            },
        },

        shutter: { type: String },

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

        length: { type: Number },
        width: { type: Number },

        room: {
            type: Number,
            default: 0,
        },
        bathroom: {
            type: Number,
            default: 0,
        },

        image: [{ type: String }],

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
    if (this.isModified('location.raw') && this.location?.raw) {
        const parts = this.location.raw.split(',').map(part => part.trim());

        this.location.normalized = parts.join(', ');

        this.location.primary = parts
            .filter(part => {
                const lowerPart = part.toLowerCase();
                return part &&
                    !/^\d+$/.test(part) &&
                    !['nepal', 'नेपाल'].includes(lowerPart);
            })
            .slice(0, 2)
            .join(', ');
    }

    next();
});

LandSchema.index({
    'location.normalized': 'text',
    'location.primary': 'text',
    description: 'text',
    name: 'text'
});

LandSchema.index({ coordinate: '2dsphere' });

const LandModel = mongoose.model("Land", LandSchema);
export default LandModel;
