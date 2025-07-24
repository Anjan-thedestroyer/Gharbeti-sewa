import React from 'react'
import HostelController from './component/HostelController'
import Navbar from './component/Navbar'
import { useEffect } from 'react';

const MyWorks = () => {
    useEffect(() => {
        document.title = "Your Hostel";
    }, []);
    return (

        <div>
            <Navbar color='no' />
            <HostelController />
        </div>
    )
}

export default MyWorks
