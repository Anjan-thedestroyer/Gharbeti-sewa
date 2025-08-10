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
        raw: { type: String, required: true },
        normalized: { type: String },
        primary: { type: String }
    },

    description: {
        type: String,
        required: true
    },

    coordinate: {
        lon: { type: Number },
        lat: { type: Number }
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
        type: String,
        validate: {
            validator: v => /^\d{10}$/.test(v),
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

    image: [{ type: String }],

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

}, { timestamps: true });

// Pre-save hook for location formatting
HostelSchema.pre('save', function (next) {
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

// Single text index
HostelSchema.index({
    'location.normalized': 'text',
    'location.primary': 'text',
    description: 'text',
    name: 'text'
});

// Geospatial index
HostelSchema.index({ coordinate: '2dsphere' });

const HostelModel = mongoose.model("Hostel", HostelSchema);
export default HostelModel;
