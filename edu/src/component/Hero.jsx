import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('np');

  useEffect(() => {
    const interval = setInterval(() => {
      setLanguage(prev => (prev === 'en' ? 'np' : 'en'));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const content = {
    en: {
      title: "Ghar Beti Sewa",
      description: "Effortlessly list your house or hostel for rent, or find the perfect place at the right price — all in one place.",
      gharbeti: "Be a Gharbeti",
      hostel: "Find Hostel",
      gharBhada: "Get Ghar Bhada",
      metaTitle: "Ghar Beti Sewa - Nepal's Premier Rental Platform",
      metaDescription: "Find or list rental properties in Nepal. Connect landlords with tenants through our trusted platform."
    },
    np: {
      title: "घरबेटी सेवा",
      description: "आफ्नो घर वा होस्टल सजिलै भाडामा राख्नुस् वा उपयुक्त मूल्यमा उपयुक्त स्थान पत्ता लगाउनुस् — सबै एकै ठाउँमा।",
      gharbeti: "घरबेटी बन्नुहोस्",
      hostel: "होस्टल खोज्नुहोस्",
      gharBhada: "घर भाडा पाउनुहोस्",
      metaTitle: "घरबेटी सेवा - नेपालको प्रमुख भाडा प्लेटफर्म",
      metaDescription: "नेपालमा भाडाका लागि घर वा होस्टल खोज्नुहोस् वा सूचीकरण गर्नुहोस्। विश्वसनीय प्लेटफर्म मार्फत मालिक र भाडादारहरू जोड्नुहोस्।"
    }
  };

  const lang = content[language];

  return (
    <>
      <Helmet>
        <title>{lang.metaTitle}</title>
        <meta name="description" content={lang.metaDescription} />
        <meta property="og:title" content={lang.metaTitle} />
        <meta property="og:description" content={lang.metaDescription} />
        <meta name="keywords" content="Nepal rental, house for rent Nepal, hostel Kathmandu, ghar bhada, घर भाडा नेपाल" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Ghar Beti Sewa",
              "url": "https://www.gharbetisewa.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.gharbetisewa.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      </Helmet>

      <section className='hero container' itemScope itemType="https://schema.org/RealEstateAgent">
        <div className='hero-text'>
          <h1 itemProp="name">{lang.title}</h1>
          <p itemProp="description">{lang.description}</p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate('/gharbeti')}
              className='btn left text'
              itemProp="potentialAction"
              aria-label={lang.gharbeti}
            >
              {lang.gharbeti}
            </button>
            <button
              onClick={() => navigate('/bhada/hostel')}
              className='btn right text'
              itemProp="potentialAction"
              aria-label={lang.hostel}
            >
              {lang.hostel}
            </button>
            <button
              onClick={() => navigate('/bhada/bhada')}
              className='btn center text'
              itemProp="potentialAction"
              aria-label={lang.gharBhada}
            >
              {lang.gharBhada}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;