import React from 'react';
import { Helmet } from 'react-helmet';
import './Campus.css';
import gallery_1 from '../assets/edusity_assets/gallery-1.png';
import gallery_2 from '../assets/edusity_assets/gallery-2.png';
import gallery_3 from '../assets/edusity_assets/gallery-3.png';
import gallery_4 from '../assets/edusity_assets/gallery-4.png';

function Campus() {
  // Image data with proper alt text for SEO
  const galleryImages = [
    { src: gallery_1, alt: "Gharbeti-Sewa hostel exterior view with modern facilities" },
    { src: gallery_2, alt: "Comfortable living room at Gharbeti-Sewa student hostel" },
    { src: gallery_3, alt: "Study area in Gharbeti-Sewa hostel for students" },
    { src: gallery_4, alt: "Cafeteria and dining space at Gharbeti-Sewa accommodation" }
  ];

  return (
    <div className='campus'>
      <Helmet>
        <meta name="description" content="View our Gharbeti-Sewa hostel facilities gallery - comfortable, affordable student housing with modern amenities" />
        <meta property="og:title" content="Hostel Facilities | Gharbeti-Sewa" />
        <meta property="og:description" content="Explore our student hostel accommodations through our photo gallery" />
        <meta property="og:image" content={gallery_1} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "name": "Gharbeti-Sewa",
            "description": "Affordable student hostel accommodation",
            "image": [gallery_1, gallery_2, gallery_3, gallery_4],
            "url": window.location.href
          })}
        </script>
      </Helmet>

      <div className="gallery">
        {galleryImages.map((image, index) => (
          <img
            key={`gallery-img-${index}`}
            src={image.src}
            alt={image.alt}
            className="gallery-image"
            loading={index > 1 ? "lazy" : "eager"}
          />
        ))}
      </div>
    </div>
  );
}

export default Campus;