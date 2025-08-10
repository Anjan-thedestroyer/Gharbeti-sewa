import React from 'react'
import './About.css'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

const About = () => {
  const navigation = useNavigate()
  const handleClick = () => {
    navigation('/hostel')
  }

  return (
    <>
      <Helmet>
        <title>Gharbeti-sewa</title>
        <meta name="description" content="Easily list your hostel for rent on Ghar Beti Sewa, Nepal’s trusted platform for rental and accommodation." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://gharbeti-sewa.com/about" />

        <meta property="og:title" content="Add Hostel – Ghar Beti Sewa" />
        <meta property="og:description" content="Add your hostel listing quickly and reach more tenants in Nepal." />
        <meta property="og:url" content="https://gharbeti-sewa.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://gharbeti-sewa.com/assets/hostel-preview.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Add Hostel | Ghar Beti Sewa" />
        <meta name="twitter:description" content="Nepal’s best platform for hostel and rental listings." />
        <meta name="twitter:image" content="https://gharbeti-sewa.com/assets/hostel-preview.png" />
      </Helmet>

      <div onClick={handleClick} className='about'>
        <div className='icons ' >
          Add Hostel
        </div>
      </div>
    </>
  )
}

export default About
