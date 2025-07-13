import express from 'express'
import { AddBuyerHostel, AddBuyerLandlord, GetBuyersByHostel, GetBuyersByLand } from '../controller/buyer.controller.js'

const BuyerRoute = express.Router()

BuyerRoute.post('/add-buyer/:id', AddBuyerLandlord)
BuyerRoute.post('/add-buyer/hostel/:id', AddBuyerHostel)
BuyerRoute.get('/get-hostel/:id', GetBuyersByHostel)
BuyerRoute.get('/get-land/:id', GetBuyersByLand)

export default BuyerRoute