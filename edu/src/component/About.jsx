import React from 'react'
import './About.css'
import { useNavigate, useNavigation } from 'react-router-dom'



const About = () => {
  const navigation = useNavigate()
  const handleClick = () => {
    navigation('/hostel')
  }
  return (
    <div onClick={handleClick} className='about'>
      <div className='icon ' >
        Add Hostel
      </div>
    </div>
  )
}

export default About
