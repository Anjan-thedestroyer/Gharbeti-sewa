import { connectDB2 } from "../config/connectDB.js";
import BuyerModel from "../model/buyer.model.js";
import HostelModel from "../model/hostel.model.js";
import LandModel from "../model/landlord.model.js";
import { BuyerSchema } from "../model/buyer.model.js";
export async function AddBuyerLandlord(req, res) {
    try {
        const { id } = req.params;
        const { name, phone, No_of_people, No_of_rooms, email } = req.body;

        if (!name || !phone || !No_of_people || !No_of_rooms) {
            return res.status(400).json({
                message: "Please fill in all fields",
                success: false,
            });
        }

        const Buyer = await BuyerModel.create({
            name,
            phone,
            No_of_people,
            No_of_rooms,
            rent_room: id,
            email,
        });

        await LandModel.findByIdAndUpdate(id, {
            $set: { Applicants_details: Buyer._id },
            $inc: { Applicants: 1 }
        },
            {
                new: true,
                runValidators: true,
            });

        return res.status(201).json({
            message: "Buyer added successfully",
            success: true,
            data: Buyer,
        });
    } catch (error) {
        console.error("Error in AddBuyerLandlord:", error); // Log the real error
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export async function AddBuyerHostel(req, res) {
    try {
        const { id } = req.params;
        const { name, phone, No_of_people, No_of_rooms } = req.body;

        if (!name || !phone || !No_of_people || !No_of_rooms) {
            return res.status(400).json({
                message: "Please fill in all fields",
                success: false,
            });
        }

        const Buyer = await BuyerModel.create({
            name,
            phone,
            No_of_people,
            No_of_rooms,
            hostel: id,
        });

        const Hostel = await HostelModel.findByIdAndUpdate(
            id,
            {
                $push: { buyer: Buyer._id },  // ✅ Add to array instead of overwriting
                $inc: { Applicants: 1 },
            },
            { new: true }
        );

        if (!Hostel) {
            return res.status(404).json({
                message: "Hostel not found",
                success: false,
            });
        }

        return res.status(201).json({
            message: "Buyer added successfully",
            success: true,
            data: Buyer,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}


export async function GetBuyersByHostel(req, res) {
    try {
        const { hostel } = req.params
        const Buyer = await BuyerModel.find({ hostel }).populate('hostel')
        if (!Buyer) {
            return res.status(404).json({
                message: "No buyer found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Buyers found successfully",
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}
export async function GetBuyersByLand(req, res) {
    try {
        const { rent_room } = req.params
        const Buyer = await BuyerModel.find({ rent_room }).populate('rent_room')
        if (!Buyer) {
            return res.status(404).json({
                message: "No buyer found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Buyers found successfully",
            success: true,

        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}
export async function GetBuyers(req, res) {
    try {
        const Buyer = await BuyerModel.find().populate('hostel').populate('rent_room')
        return res.status(200).json({
            message: "Buyers found successfully",
            success: true,
            data: Buyer
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}
export async function MarkAsComplete(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Invalid request",
                success: false,
                error: true
            });
        }

        const buyer = await BuyerModel.findByIdAndUpdate(id, {
            complete: true
        }, { new: true });

        if (!buyer) {
            return res.status(404).json({
                message: "No buyer found",
                success: false,
                error: true
            });
        }

        const secondConn = await connectDB2();
        const Buyer2Model = secondConn.model('Buyer', BuyerSchema);

        const newBuyer = new Buyer2Model(buyer.toObject());
        await newBuyer.save();

        await BuyerModel.findByIdAndDelete(id);

        await secondConn.close();

        return res.status(200).json({
            message: "Buyer moved to archive (DB2) and deleted from main DB",
            success: true,
            error: false
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error: true
        });
    }
}
export async function deleteBuyer(req, res) {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Invalid request",
                success: false,
                error: true
            })
        }
        const Buyer = await BuyerModel.findByIdAndDelete(id)
        return res.status(200).json({
            message: "Buyer deleted",
            success: true,
            error: false,
            data: Buyer
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error: true
        });
    }
}
