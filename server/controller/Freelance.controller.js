import mongoose from "mongoose"
import freelanceModel from "../model/Freelance.model.js"
import TaskModel from "../model/Task.model.js"
import UserModel from "../model/user.model.js"
import uploadImageClodinary from "../utils/uploadImageClodinary.js"
import LandModel from "../model/landlord.model.js"

export async function AddFreelancer(req, res) {
    try {
        const userId = req.userId
        const { name, email, phone, location, message } = req.body
        if (!userId) {
            return res.status(401).json({
                message: "Please login first to be a freelancer",
                error: true,
                success: false
            })
        }
        if (!name || !email || !phone || !location || !message) {
            return res.status(400).json({
                message: "Please fill all the fields",
                error: true,
                success: false
            })
        }
        const freelancer = await freelanceModel.create({
            userId: userId,
            name,
            email,
            phone,
            location,
            message
        })

        return res.status(201).json({
            message: "Freelancer added successfully",
            error: false,
            success: true,
            data: freelancer
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error adding freelancer",
            error: true,
            success: false
        })
    }
}
export async function UpdateFreelancer(req, res) {
    try {
        const userId = req.userId
        const { id } = req.params
        const { name, email, phone, location, message } = req.body
        if (!userId) {
            return res.status(401).json({
                message: "Please login first to update",
                error: true,
                success: false
            })
        }
        if (!id) {
            return res.status(400).json({
                message: "Please provide freelancer id",
                error: true,
                success: false
            })
        }
        const exist = await freelanceModel.findById(id)
        if (!exist) {
            return res.status(400).json({
                message: "Freelancer not found",
                error: true,
                success: false
            })
        }
        if (userId !== existingHostel.userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this hostel",
                success: false,
            });
        }
        const update = {
            ...(name && { name }),
            ...(email && { email }),
            ...(phone && { phone }),
            ...(location && { location }),
            ...(message && { message }),
        }
        const updatedFreelancer = await freelanceModel.findByIdAndUpdate(id, update, {
            new: true
        })
        return res.status(200).json({
            message: "Freelancer updated successfully",
            error: false,
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        })
    }
}
export async function VerifyFreelancer(req, res) {
    try {
        const { id } = req.params;

        const freelancer = await freelanceModel.findById(id);
        if (!freelancer) {
            return res.status(400).json({
                message: "Freelancer not found",
                error: true,
                success: false
            });
        }

        const userId = freelancer.userId;


        await UserModel.findByIdAndUpdate(userId, {
            $set: { freelancerId: freelancer._id }
        });


        await freelanceModel.findByIdAndUpdate(id, {
            $set: { verified: true }
        });

        return res.status(200).json({
            message: "Freelancer verified successfully",
            error: false,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
}


export async function DeleteFreelancer(req, res) {
    try {
        const userId = req.userId
        const { id } = req.params
        const DeleteFreelancer = await freelanceModel.findByIdAndDelete(id)
        return res.status(200).json({
            message: "Freelancer deleted successfully",
            error: false,
            success: true
        })
    } catch {
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        })
    }
}
export async function GetUnVerifiedFreelancer(req, res) {
    try {
        const freelance = await freelanceModel.find({ verified: false })
        return res.status(200).json({
            message: "Unverified freelancers found",
            error: false,
            success: true,
            data: freelance
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        })
    }
}
export async function GetVerifiedFreelancer(req, res) {
    try {
        const freelance = await freelanceModel.find({ verified: true })
        return res.status(200).json({
            message: "Freelancers retrieved successfully",
            error: false,
            success: true,
            data: freelance
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        })
    }
}
export async function GetVerifiedWithLocation(req, res) {
    try {
        const { location = "" } = req.query;
        const trimmedQuery = location.trim();

        let freelancers = [];

        if (trimmedQuery) {
            freelancers = await freelanceModel.find(
                {
                    $text: { $search: trimmedQuery },
                    verified: true
                },
                {
                    score: { $meta: "textScore" }
                }
            ).sort({ score: { $meta: "textScore" } });
        }

        if (!freelancers.length) {
            freelancers = await freelanceModel.find({ verified: true });
        }

        res.status(200).json({
            success: true,
            message: "Verified freelancers fetched successfully",
            data: freelancers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching freelancers",
            error: error.message
        });
    }
}
export async function assignTaskToFreelancers(req, res) {
    try {
        const { roomId } = req.params
        const { description, freelancerIds } = req.body;

        if (!roomId || !Array.isArray(freelancerIds) || freelancerIds.length === 0) {
            return res.status(400).json({
                message: "Invalid input",
                error: true,
                success: false
            });
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        const task = await TaskModel.create({
            description,
            room: roomId,
            expiry: expiryDate,
            assignedTo: freelancerIds
        });
        await freelanceModel.updateMany({ _id: { $in: freelancerIds } },
            { $push: { task: task._id } }, { new: true })
        return res.status(201).json({
            message: "Task assigned to freelancers",
            success: true,
            data: task
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        })
    }
}
export async function getTask(req, res) {
    try {
        const userId = req.userId;

        const freelancer = await freelanceModel
            .findOne({ userId })
            .populate({
                path: 'task',
                populate: {
                    path: 'room',
                    model: 'Land'
                }
            });

        if (!freelancer) {
            return res.status(404).json({
                message: "Freelancer not found",
                error: true,
                success: false
            });
        }
        const unacceptedTasks = freelancer.task.filter(task => !task.isAccepted);

        return res.status(200).json({
            message: "Unaccepted tasks fetched successfully",
            success: true,
            data: { task: unacceptedTasks }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while fetching tasks",
            error: true,
            details: error.message
        });
    }
}


export async function acceptTask(req, res) {
    try {
        const { taskId } = req.params;
        const userId = req.userId;

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (task.isAccepted) {
            return res.status(400).json({
                success: false,
                message: "Task already accepted"
            });
        }

        const freelancer = await freelanceModel.findOne({ userId }).populate("task");
        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: "Freelancer not found"
            });
        }

        const alreadyAcceptedFromRoom = freelancer.task.some(
            (t) => t.isAccepted && t.room.toString() === task.room.toString()
        );

        if (alreadyAcceptedFromRoom) {
            return res.status(403).json({
                success: false,
                message: "You have already accepted a task from this room.",
            });
        }

        task.isAccepted = true;
        task.acceptedBy = freelancer._id;
        await task.save();

        freelancer.task.push(task._id);
        await freelancer.save();

        res.status(200).json({
            success: true,
            message: "Task accepted successfully",
            task,
        });

    } catch (error) {
        console.error("Error in acceptTask:", error);
        res.status(500).json({
            success: false,
            message: "Server error while accepting task",
        });
    }
};

export async function getAcceptedTask(req, res) {
    try {
        const userId = req.userId;

        const freelancer = await freelanceModel
            .findOne({ userId })
            .populate({
                path: 'task',
                populate: {
                    path: 'room',
                    model: 'Land'
                }
            });
        if (!freelancer) {
            return res.status(404).json({
                message: "Freelancer not found",
                error: true,
                success: false
            });
        }
        const acceptedTasks = await TaskModel.find({
            isAccepted: true,
            acceptedBy: freelancer._id,
            isCompleted: false
        }).populate('room').populate('assignedTo');

        return res.status(200).json({
            message: "Accepted tasks fetched successfully",
            success: true,
            data: acceptedTasks
        });

    } catch (error) {
        console.error("Error in getAcceptedTask:", error);
        return res.status(500).json({
            message: "Server error while fetching task",
            error: true,
            success: false
        });
    }
}
export async function rejectTask(req, res) {
    try {
        const freelancerId = req.userId;
        const { taskId } = req.params;

        const freelancer = await freelanceModel.findById(freelancerId);
        if (!freelancer) {
            return res.status(404).json({
                message: "Freelancer not found",
                error: true,
                success: false
            });
        }

        const taskIndex = freelancer.task.findIndex(t => t._id.toString() === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Task not found in your list",
                error: true,
                success: false
            });
        }

        freelancer.task.splice(taskIndex, 1);
        await freelancer.save();

        return res.status(200).json({
            message: "Task rejected and removed from your list",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error while rejecting task",
            error: true
        });
    }
}

export async function DoTask(req, res) {
    try {
        const { id } = req.params;
        const { taskId } = req.params
        const { length, width, room, bathroom, description } = req.body;
        const images = req.files;
        const freelance = await TaskModel.findByIdAndUpdate(taskId, {
            $set: { isCompleted: true }
        })
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