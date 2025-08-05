import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import BuyerRoute from './route/buyer.route.js';
import HostelRoute from './route/hostel.route.js';
import landlordRouter from './route/landlord.route.js';
import userRouter from './route/user.route.js';
import { connectDB, connectDB2 } from './config/connectDB.js'
import FreelanceRoute from './route/Freelance.route.js';
const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

// API Routes
app.use('/api/buyers', BuyerRoute);
app.use('/api/hostels', HostelRoute);
app.use('/api/landlords', landlordRouter);
app.use('/api/user', userRouter);
app.use('/api/freelance', FreelanceRoute)

app.get("/", (request, response) => {
    response.json({
        message: "Server is running",
        port: PORT
    });
});

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed", err);
    process.exit(1);
});
connectDB2()