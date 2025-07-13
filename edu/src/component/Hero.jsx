import React from 'react'
import './Hero.css'
import dark_arrow from '../assets/edusity_assets/dark-arrow.png'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <div className='hero container'>
      <div className='hero-text'>
        <h1>Ghar beti-sewa</h1>
        <p>Easily apply your house for rent or easy find a perfect house in perfect price</p>
        <button onClick={() => navigate('/gharbeti')} className='btn left text '>Gharbeti</button>
        <button onClick={() => navigate('/bhada/hostel')} className='btn right text'>Hostel</button>
        <button onClick={() => navigate('/bhada/bhada')} className='btn center text'>Ghar bhada</button>

      </div>

    </div>
  )
}

export default Hero
