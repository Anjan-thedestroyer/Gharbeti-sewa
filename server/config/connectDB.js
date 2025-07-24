import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI || !process.env.MONGODB_URI2) {
    throw new Error("Please set both MONGODB_URI and MONGODB_URI2 in your .env");
}

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Main DB connected');
    } catch (error) {
        console.log("Main DB connection error", error);
        process.exit(1);
    }
}

export async function connectDB2() {
    try {
        const tempConn = await mongoose.createConnection(process.env.MONGODB_URI2, {
            dbName: 'secondary'
        });
        console.log('Secondary DB connected');
        return tempConn;
    } catch (error) {
        console.log("Secondary DB connection error", error);
        process.exit(1);
    }
}
