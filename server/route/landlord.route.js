import express from "express";
import multer from "multer";
import {
    AddLand,
    GetLands,
    GetAllLands,
    UpdateLand,
    DeleteLand,
    VerifyLand,
    getVerifiedLand,
    getVerifiedLandByAddress,
    getVerifiedLandByAddressAndPrice,
} from "../controller/landlord.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST - Add new land
router.post("/add", AddLand);

// GET - Get single land by ID
router.get("/:id", GetLands);

// GET - Get all lands
router.get("/", GetAllLands);

// PUT - Update land by ID
router.put("/update/:id", UpdateLand);

// DELETE - Delete land by ID
router.delete("/delete/:id", DeleteLand);

router.put("/verify/:id", upload.array("image", 5), VerifyLand);

// GET - Get all verified lands
router.get("/verified/all", getVerifiedLand);

// POST - Get verified land by address
router.get("/verified/by-address", getVerifiedLandByAddress);
router.get("/verified/by-price", getVerifiedLandByAddressAndPrice)

export default router;
