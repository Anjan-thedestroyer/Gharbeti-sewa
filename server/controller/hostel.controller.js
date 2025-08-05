import HostelModel from "../model/hostel.model.js";
import uploadImageClodinary from "../utils/uploadImageClodinary.js";
import UserModel from "../model/user.model.js";
import MenuModel from "../model/Menu.model.js";

export async function AddHostel(req, res) {
    try {
        const userId = req.userId;
        const images = req.files
        const { name, location, description, room, contact_no, email, price, coordinate } = req.body;

        // Validation
        if (!name || !location || !room || !contact_no || !email || !price) {
            return res.status(400).json({
                message: "Please provide all required fields.",
                success: false,
                error: true,
            });
        }

        const check = await HostelModel.find({
            name: { $regex: new RegExp(name, 'i') }
        });

        if (check.length > 0) {
            return res.status(409).json({
                message: "Hostel already exists.",
                success: false,
            });
        }
        const uploads = await Promise.all(
            images.map((img) => uploadImageClodinary(img))
        );

        const imageUrls = uploads.map((upload) => upload.url);
        const hostel = await HostelModel.create({
            name,
            location,
            room,
            contact_no,
            email,
            userId: userId,
            price,
            image: imageUrls,
            coordinate,
            description
        });
        const user = await UserModel.findByIdAndUpdate(userId, {
            $push: { hostel: hostel._id }
        })

        return res.status(201).json({
            message: "Hostel added successfully.",
            success: true,
            data: hostel,
        });

    } catch (error) {
        console.error("AddHostel Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}
export async function verifyHostel(req, res) {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Please provide hostel id.",
                success: false,
            });
        }
        const hostel = await HostelModel.findByIdAndUpdate(
            id,
            {
                $set: { isVerified: true }

            }, { new: true })
        if (!hostel) {
            return res.status(404).json({
                message: "Hostel not found.",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Hostel verified successfully.",
            success: true,
        });


    } catch (error) {
        console.error("VerifyHostel Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}


export async function getUnverifiedHostel(req, res) {
    try {
        const hostel = await HostelModel.find({ verified: false }).populate('userId').populate('buyer')
        return res.status(200).json({
            message: "Unverified hostels retrieved successfully.",
            success: true,
            data: hostel
        })
    } catch (error) {
        console.error("GetHostel Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}
export async function getHostelById(req, res) {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Hostel ID is required",
                success: false
            })
        }
        const hostel = await HostelModel.findById(id).populate('userId').populate('buyer')
        if (!hostel) {
            return res.status(404).json({
                message: "Hostel not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Hostel retrieved successfully.",
            success: true,
            data: hostel
        })
    } catch (error) {
        console.error("GetHostelById Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}
export async function updateHostel(req, res) {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Hostel ID is required",
                success: false,
            });
        }

        const existingHostel = await HostelModel.findById(id);
        if (!existingHostel) {
            return res.status(404).json({
                message: "Hostel not found",
                success: false,
            });
        }

        if (userId !== existingHostel.userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this hostel",
                success: false,
            });
        }

        // Extract fields from req.body
        const {
            name,
            location,
            contact_no,
            email,
            price,
            coordinate,
            description,
            length,
            width,
            room,
            bathroom
        } = req.body;
        let oldImages = req.body.existingImages || [];
        if (typeof oldImages === 'string') {
            oldImages = [oldImages];
        }

        const images = req.files || [];

        // Upload new images to Cloudinary (or your upload service)
        let newImageUrls = [];
        if (images.length > 0) {
            const uploads = await Promise.all(
                images.map(img => uploadImageClodinary(img))
            );
            newImageUrls = uploads.map(upload => upload.url);
        }

        const combinedImages = [...oldImages, ...newImageUrls];

        const updates = {
            ...(name && { name }),
            ...(location && { location }),
            ...(contact_no && { contact_no }),
            ...(email && { email }),
            ...(price && { price }),
            ...(coordinate && { coordinate }),
            ...(description && { description }),
            ...(length && { length }),
            ...(width && { width }),
            ...(room && { room }),
            ...(bathroom && { bathroom }),
            ...(combinedImages.length > 0 && { image: combinedImages }),
        };

        const updatedHostel = await HostelModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        return res.status(200).json({
            message: "Hostel updated successfully.",
            success: true,
            data: updatedHostel,
        });
    } catch (error) {
        console.error("UpdateHostel Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}


export async function deleteHostel(req, res) {
    try {
        const userId = req.userId
        const { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Hostel ID is required",
                success: false
            })
        }
        const hostel = await HostelModel.findByIdAndDelete(id)
        if (hostel.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this hostel",
                success: false
            })
        }
        if (!hostel) {
            return res.status(404).json({
                message: "Hostel not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Hostel deleted successfully.",
            success: true

        })
    } catch (error) {
        console.error("DeleteHostel Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}
export async function getHostelByAddress(req, res) {
    try {
        const { location = "" } = req.query
        if (!location.trim()) {
            return res.status(400).json({ message: "Location is required" });
        }
        const hostels = await HostelModel.find({
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
            .populate('userId')
            .populate('buyer');
        return res.status(200).json({
            message: "Hostels found successfully.",
            success: true,
            data: hostels

        })
    } catch (error) {
        console.error("GetHostelByLocation Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}
export async function getHostelByPriceAndAddress(req, res) {
    try {
        const sort = req.body
        const { location } = req.body
        const sortOrder = sort === -1 ? -1 : 1;
        const hostel = await HostelModel.find({ location: location }).populate('userId').sort({ price: sortOrder }).populate('buyer')
        if (!hostel) {
            return res.status(404).json({
                message: "Hostel not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Hostel found successfully.",
            success: true,
            data: hostel
        })
    } catch (error) {
        console.error("GetHostelByPriceAndLocation Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}

export async function deleteImageByIndex(req, res) {
    try {
        const userId = req.userId;
        const { id, index } = req.body;

        const hostel = await HostelModel.findById(id);
        if (!hostel) {
            return res.status(404).json({
                message: "Hostel not found",
                success: false
            });
        }

        // Authorization check


        // Index validation
        if (index < 0 || index >= hostel.image.length) {
            return res.status(400).json({
                message: "Invalid image index",
                success: false
            });
        }

        const deletedImage = hostel.image.splice(index, 1)[0]; // remove image
        await hostel.save(); // persist change

        return res.status(200).json({
            message: "Image deleted successfully",
            deletedImage,
            images: hostel.image,
            success: true
        });

    } catch (error) {
        console.error("deleteImageByIndex Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export async function addMenu(req, res) {
    try {
        const userId = req.userId;
        const { id } = req.params;  // hostel ID
        const { days } = req.body;

        const menu = await MenuModel.create({
            hostel: id,
            days
        });

        const hostel = await HostelModel.findByIdAndUpdate(
            id,
            {
                $push: { menus: menu._id }
            },
            { new: true }
        ).populate('menus')

        return res.status(201).json({
            success: true,
            message: "Menu added successfully.",
            data: {
                menu,
                hostel
            }
        });

    } catch (error) {
        console.error("Error in addMenu:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add menu.",
            error: error.message
        });
    }
}
export async function sold(req, res) {
    try {
        const { id } = req.params
        const Hostel = await HostelModel.findByIdAndUpdate(id, {
            $set: { sold: true }
        }, { new: true })
        return res.status(200).json({
            message: "Data fetched successfully",
            success: true,
            error: false,
            data: Hostel
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })

    }
}