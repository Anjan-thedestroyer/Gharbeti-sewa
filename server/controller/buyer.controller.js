import BuyerModel from "../model/buyer.model.js";
import HostelModel from "../model/hostel.model.js";
import LandModel from "../model/landlord.model.js";

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
            id,
        });

        const Hostel = await HostelModel.findByIdAndUpdate(
            id,
            {
                $set: { Buyer: Buyer._id },
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
