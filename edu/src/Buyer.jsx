import React from 'react'
import Navbar from './component/Navbar'
import Searchbar from './component/Searchbar'
import { useState } from 'react'
import './Buyer.css'
import ListGhar from './component/ListGhar'

const Buyer = () => {
    const [selectedAddress, setSelectedAddress] = useState("")

    return (
        <div className='main'>
            <div className='nav'><Navbar color='no' /></div>
            <Searchbar onPlaceSelect={(data) => setSelectedAddress(data.location)} />
            <ListGhar data={selectedAddress} />
        </div>
    )
}

export default Buyer