import express from 'express'
import { acceptTask, AddFreelancer, assignTaskToFreelancers, DeleteFreelancer, DoTask, getAcceptedTask, getTask, GetUnVerifiedFreelancer, GetVerifiedFreelancer, GetVerifiedWithLocation, UpdateFreelancer, VerifyFreelancer } from '../controller/Freelance.controller.js'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import multer from 'multer'
const FreelanceRoute = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
FreelanceRoute.post('/add', auth, AddFreelancer)
FreelanceRoute.put('/verify/:id', VerifyFreelancer)
FreelanceRoute.put('/update/:id', auth, UpdateFreelancer)
FreelanceRoute.delete('/delete/:id', auth, DeleteFreelancer)
FreelanceRoute.get('/unverified', GetUnVerifiedFreelancer)
FreelanceRoute.get('/verified', GetVerifiedFreelancer)
FreelanceRoute.post('/assign/:roomId', assignTaskToFreelancers)
FreelanceRoute.get('/verified-location', GetVerifiedWithLocation)
FreelanceRoute.get('/get-task', auth, getTask)
FreelanceRoute.put('/accept/:taskId', auth, acceptTask)
FreelanceRoute.get('/accepted', auth, getAcceptedTask)
FreelanceRoute.put('/complete/:id/:taskId', upload.array('image', 5), DoTask)

export default FreelanceRoute

