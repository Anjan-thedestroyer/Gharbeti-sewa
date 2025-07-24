import React, { useEffect, useState } from 'react'
import './Hero.css'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  const [language, setLanguage] = useState('np')

  useEffect(() => {
    const interval = setInterval(() => {
      setLanguage(prev => (prev === 'en' ? 'np' : 'en'));
    }, 20000);

    return () => clearInterval(interval);
  }, []);
  const content = {
    en: {
      title: "Ghar Beti Sewa",
      description:
        "Effortlessly list your house or hostel for rent, or find the perfect place at the right price — all in one place.",
      gharbeti: "Be a Gharbeti",
      hostel: "Find Hostel",
      gharBhada: "Get Ghar Bhada"
    },
    np: {
      title: "घरबेटी सेवा",
      description:
        "आफ्नो घर वा होस्टल सजिलै भाडामा राख्नुस् वा उपयुक्त मूल्यमा उपयुक्त स्थान पत्ता लगाउनुस् — सबै एकै ठाउँमा।",
      gharbeti: "घरबेटी बन्नुहोस्",
      hostel: "होस्टल खोज्नुहोस्",
      gharBhada: "घर भाडा पाउनुहोस्"
    }
  }


  const lang = content[language]

  return (
    <div className='hero container'>
      <div className='hero-text'>
        <h1>{lang.title}</h1>
        <p>{lang.description}</p>
        <button onClick={() => navigate('/gharbeti')} className='btn left text'>
          {lang.gharbeti}
        </button>
        <button onClick={() => navigate('/bhada/hostel')} className='btn right text'>
          {lang.hostel}
        </button>
        <button onClick={() => navigate('/bhada/bhada')} className='btn center text'>
          {lang.gharBhada}
        </button>
      </div>
    </div>
  )
}

export default Hero
