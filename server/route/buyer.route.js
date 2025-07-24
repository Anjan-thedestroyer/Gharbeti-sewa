import express from 'express'
import { AddBuyerHostel, AddBuyerLandlord, deleteBuyer, GetBuyers, GetBuyersByHostel, GetBuyersByLand, MarkAsComplete } from '../controller/buyer.controller.js'

const BuyerRoute = express.Router()

BuyerRoute.post('/add-buyer/:id', AddBuyerLandlord)
BuyerRoute.post('/add-buyer/hostel/:id', AddBuyerHostel)
BuyerRoute.get('/get-hostel/:id', GetBuyersByHostel)
BuyerRoute.get('/get-land/:id', GetBuyersByLand)
BuyerRoute.get('/get', GetBuyers)
BuyerRoute.delete('/delete-buyer/:id', deleteBuyer)
BuyerRoute.put('/mark-buyer/:id', MarkAsComplete)

export default BuyerRoute