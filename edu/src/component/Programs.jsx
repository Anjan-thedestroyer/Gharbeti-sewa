import React from 'react'
import './Programs.css'
import program_1 from '../assets/edusity_assets/program-1.png'
import program_2 from '../assets/edusity_assets/program-2.jpg'
import program_3 from '../assets/edusity_assets/program-3.jpg'



const Programs = () => {
    return (
        <div className='programs' >
            <div className='program'>
                <img src={program_3} alt='' />
                <div className="caption">
                    <p>Beautiful houses</p>
                </div>
            </div>
            <div className='program'>
                <img src={program_2} alt='' />
                <div className="caption">
                    <p>Any part of Nepal</p>
                </div>
            </div>
            <div className='program'>
                <img src={program_1} alt='' />
                <div className="caption">
                    <p>Easy verification and listing of the house</p>
                </div>
            </div>

        </div>
    )
}

export default Programs
