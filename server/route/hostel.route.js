import express from 'express'
import auth from '../middleware/auth.js'
import { AddHostel, deleteHostel, deleteImageByIndex, getHostelByAddress, getHostelById, getHostelByPriceAndAddress, getUnverifiedHostel, sold, updateHostel, verifyHostel } from '../controller/hostel.controller.js'
import multer from 'multer'
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HostelRoute = express.Router()

HostelRoute.post('/add-hostel', auth, upload.array('image', 5), AddHostel)
HostelRoute.put('/verify/:id', verifyHostel)
HostelRoute.get('/get-unhostel', getUnverifiedHostel)
HostelRoute.get('/get-address', getHostelByAddress)
HostelRoute.get('/get/:id', getHostelById)
HostelRoute.get('/by-address', getHostelByAddress)
HostelRoute.get('/get-priceaddress', getHostelByPriceAndAddress)
HostelRoute.delete('/delete-hostel/:id', auth, deleteHostel)
HostelRoute.put('/delete-image', auth, deleteImageByIndex)
HostelRoute.put('/edit-details/:id', auth, upload.array('image', 5), updateHostel)
HostelRoute.put('/sold/:id', sold)

export default HostelRoute;