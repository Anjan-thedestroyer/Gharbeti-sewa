import LandModel from "../model/landlord.model.js"
import uploadImageClodinary from "../utils/uploadImageClodinary.js"

export async function AddLand(req, res) {
    try {
        const { name, location, coordinate, Contact_no1, Contact_no2, price
            , shutter
        } = req.body
        if (!name || !location || !Contact_no1 || !Contact_no2 || !price) {
            return res.status(400).json({ message: "Please fill all the fields." })

        }
        const land = await LandModel.create({
            name,
            location,
            Contact_no1,
            Contact_no2,
            coordinate,
            price,
            shutter
        })
        res.status(201).json({ message: "Landlord Added Successfully", data: land })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export async function GetLands(req, res) {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Please fill all the fields." })
        }
        const land = await LandModel.findById(id).populate('Applicants_details')
        if (!land) {
            return res.status(404).json({ message: "Land not found." })
        }
        res.status(200).json({ message: "Land found", data: land })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export async function GetAllLands(req, res) {
    try {
        const lands = await LandModel.find({ verified: false })
        res.status(200).json({ message: "All Lands found", data: lands })

    } catch {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export async function UpdateLand(req, res) {
    try {
        const { id } = req.params
        const userId = req.userId
        const { name, coordinate, location, Contact_no1, Contact_no2, price, room, shutter } = req.body
        const land = await LandModel.findById(id)
        if (!land) {
            return res.status(404).json({
                message: "Hostel not found",
                success: false
            });
        }

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (location !== undefined) updates.location = location;
        if (Contact_no1 !== undefined) updates.contact_no = Contact_no1;
        if (Contact_no2 !== undefined) updates.contact_no = Contact_no2;
        if (room !== undefined) updates.room = room
        if (price !== undefined) updates.price = price;
        if (coordinate !== undefined) updates.coordinate = coordinate;
        if (shutter !== undefined) updates.shutter = shutter;

        if (!id) {
            return res.status(400).json({ message: "Please fill all the fields." })
        }
        const updateLand = await LandModel.findByIdAndUpdate(id, {
            $set: updates
        }, { new: true })
        res.status(200).json({ message: "Land Updated Successfully", data: land })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export async function DeleteLand(req, res) {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Please fill all the fields." })
        }
        const land = await LandModel.findByIdAndDelete(id)
        res.status(200).json({ message: "Land Deleted Successfully", data: land })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function VerifyLand(req, res) {
    try {
        const { id } = req.params;
        const { length, width, room, bathroom, description } = req.body;
        const images = req.files;

        if (!length || !width || !room || !bathroom || !description) {
            return res.status(401).json({ message: "Please fill all the fields." });
        }
        if (!images || images.length === 0) {
            return res.status(402).json({ message: "Please upload at least one image." });
        }
        const uploads = await Promise.all(
            images.map((img) => uploadImageClodinary(img))
        );
        const imageUrls = uploads.map((upload) => upload.url);
        const land = await LandModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    length,
                    width,
                    room,
                    bathroom,
                    description,
                    image: imageUrls,
                    verified: true,
                },
            },
            { new: true }
        );
        res.status(200).json({ message: "Land Verified Successfully", data: land });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function getVerifiedLand(req, res) {
    try {
        const land = await LandModel.find({ verified: true }).populate('buyer')
        res.status(200).json({ message: "Land Verified Successfully", data: land })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getVerifiedLandByAddress(req, res) {
    try {
        const { location = "" } = req.query;

        if (!location.trim()) {
            return res.status(400).json({ message: "Address is required" });
        }

        const land = await LandModel.find(
            {
                verified: true,
                $text: { $search: location },
            },
            {
                score: { $meta: "textScore" },
            }
        )
            .sort({
                score: { $meta: "textScore" },
                sold: 1
            })
            .populate("Applicants_details");


        return res.status(200).json({
            message: "Land fetched successfully",
            data: land,
        });
    } catch (err) {
        console.error("Search Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function getVerifiedLandByAddressAndPrice(req, res) {
    try {
        const sort = req.body
        const sortOrder = sort === -1 ? -1 : 1;
        const { location = "" } = req.query;
        const land = await LandModel.find(
            {
                verified: true,
                $text: { $search: location },
            },
            {
                score: { $meta: "textScore" },
            }
        )
            .sort({ price: sortOrder })
            .populate("Applicants_details");

        return res.status(200).json({
            message: "Land fetched successfully",
            data: land,

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export async function sold(req, res) {
    try {
        const { id } = req.params
        const land = await LandModel.findByIdAndUpdate(id, {
            $set: { sold: true }
        }, { new: true })
        return res.status(200).json({
            message: "Data fetched successfully",
            success: true,
            error: false,
            data: land
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })

    }
}