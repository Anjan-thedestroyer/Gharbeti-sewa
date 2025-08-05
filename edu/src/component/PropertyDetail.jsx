import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axiosInstance from '../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import './PropertyDetail.css';

const PropertyDetail = ({ propertyId, onClose, type }) => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showFullImage, setShowFullImage] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            setLoading(true);
            try {
                const isHostelType = type === 'hostel';
                const url = isHostelType
                    ? `/hostels/get/${propertyId}`
                    : `/landlords/${propertyId}`;
                const response = await axiosInstance.get(url);
                setProperty(response.data.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch property details:", err);
                setError("Failed to load property details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (propertyId && type) {
            fetchPropertyDetails();
        }
    }, [propertyId, type]);

    const handleApply = async (_id) => {
        const dataType = id === 'hostel' ? 'Hostel' : 'Landlord';
        localStorage.setItem('myData', JSON.stringify({ data: dataType }));
        navigate(`/apply/${_id}`);
    };

    const handleThumbnailClick = (index, e) => {
        e.stopPropagation();
        setActiveImageIndex(index);
    };

    const handleMainImageClick = () => {
        if (property?.image?.length > 0) {
            setShowFullImage(true);
        }
    };

    const handleCloseFullImage = () => {
        setShowFullImage(false);
    };

    const navigateImage = (direction) => {
        if (!property?.image) return;

        setActiveImageIndex(prev =>
            direction === 'prev'
                ? prev === 0 ? property.image.length - 1 : prev - 1
                : prev === property.image.length - 1 ? 0 : prev + 1
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateArea = (width, length) => {
        return width && length ? width * length : null;
    };

    if (loading) {
        return (
            <div className="property-detail-overlay">
                <div className="property-detail-container">
                    <button className="close-button" onClick={onClose} aria-label="Close property details">×</button>
                    <div className="loading-spinner">Loading property details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="property-detail-overlay">
                <div className="property-detail-container">
                    <button className="close-button" onClick={onClose} aria-label="Close property details">×</button>
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    if (!property) return null;

    const area = calculateArea(property.width, property.length);
    const propertyType = type === 'hostel' ? 'Hostel' : 'Property';
    const price = property.pricing?.toLocaleString() || 'Price on request';
    const structuredData = property && {
        "@context": "https://schema.org",
        "@type": type === 'hostel' ? "Hostel" : "House",
        "name": property.location,
        "description": property.description || `${propertyType} in ${property.location}`,
        "image": property.image?.[0],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": property.location
        },
        "offers": {
            "@type": "Offer",
            "price": property.pricing,
            "priceCurrency": "NPR"
        },
        "numberOfRooms": property.Rooms || property.room,
        "numberOfBathroomsTotal": property.bathroom,
        "floorSize": area ? `${area} sq.ft.` : undefined
    };

    return (
        <>
            <Helmet>
                <title>{property.location} | {propertyType} Details</title>
                <meta name="description" content={`View details of this ${propertyType.toLowerCase()} in ${property.location}. ${property.description?.substring(0, 160) || ''}`} />
                <meta property="og:title" content={`${property.location} | ${propertyType} Details`} />
                <meta property="og:description" content={`${propertyType} in ${property.location} available for Rs. ${price}`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                {property.image?.[0] && <meta property="og:image" content={property.image[0]} />}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <div className="property-detail-overlay" onClick={onClose}>
                <div className="property-detail-container" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={onClose} aria-label="Close property details">×</button>

                    <div className="property-detail-content" itemScope itemType={type === 'hostel' ? "https://schema.org/Hostel" : "https://schema.org/House"}>
                        {/* Image Gallery */}
                        <div className="image-gallery">
                            <div
                                className={`main-image ${property.image?.length > 0 ? 'clickable' : ''}`}
                                onClick={handleMainImageClick}
                            >
                                {property.image?.[0] ? (
                                    <img
                                        src={property.image[activeImageIndex]}
                                        alt={`${property.location} ${propertyType}`}
                                        itemProp="image"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="image-placeholder">No Image Available</div>
                                )}
                            </div>
                            {property.image?.length > 1 && (
                                <div className="thumbnail-container">
                                    {property.image.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                                            onClick={(e) => handleThumbnailClick(index, e)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail view ${index + 1} of ${property.location}`}
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleApply(property._id)}
                            className="status-badge1 verified"
                            aria-label={`Apply for this ${propertyType.toLowerCase()}`}
                        >
                            APPLY NOW
                        </button>

                        <div className="property-info">
                            <div className="property-header">
                                <h1 itemProp="name">{property.location}</h1>
                                <div className="price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                    <span itemProp="price" content={property.pricing || property.price}>Rs. {property.price || property.pricing}</span>
                                    <meta itemProp="priceCurrency" content="NPR" />
                                </div>
                                <div className="status-badges">
                                    {property.sold && <span className="status-badge sold">Sold</span>}
                                    {property.verified && <span className="status-badge verified">Verified</span>}
                                </div>
                            </div>

                            <div className="property-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Property name:</span>
                                    <span className="meta-value" itemProp="seller">{property.name || 'Owner'}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Posted:</span>
                                    <span className="meta-value">{formatDate(property.createdAt)}</span>
                                </div>
                            </div>

                            <div className="property-description">
                                <h3>Description</h3>
                                <p itemProp="description">{property.description || 'No detailed description provided for this property.'}</p>
                            </div>

                            <div className="property-specs">
                                <h3>Specifications</h3>
                                <div className="specs-grid">
                                    {property.bathroom && (
                                        <div className="spec-item">
                                            <span className="spec-value" itemProp="numberOfBathroomsTotal">{property.bathroom}</span>
                                            <span className="spec-label">Bathrooms</span>
                                        </div>
                                    )}
                                    {property.room !== 0 && (
                                        <div className="spec-item">
                                            <span className="spec-value" itemProp="numberOfRooms">{property.room}</span>
                                            <span className="spec-label">Rooms</span>
                                        </div>
                                    )}
                                    {area && (
                                        <div className="spec-item">
                                            <span className="spec-value" itemProp="floorSize">{area} sq.ft.</span>
                                            <span className="spec-label">Total Area</span>
                                        </div>
                                    )}
                                    {property.width && property.length && (
                                        <div className="spec-item">
                                            <span className="spec-value">{property.width} × {property.length}</span>
                                            <span className="spec-label">Dimensions</span>
                                        </div>
                                    )}
                                    {property.Applicants !== 0 && (
                                        <div className="spec-item">
                                            <span className="spec-value">{property.Applicants}</span>
                                            <span className="spec-label">Number of applicants</span>
                                        </div>
                                    )}
                                    {Number(property.shutter) > 0 && (
                                        <div className='spec-item'>
                                            <span className="spec-value" itemProp="numberOfShutters">{property.shutter}</span>
                                            <span className="spec-label">No of Shutter</span>
                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className="property-contact">
                                <h3>Contact Information</h3>
                                <div className="contact-info">
                                    <span className="contact-label">Primary contact:</span>
                                    <a
                                        href={`tel:${property.Contact_no1}`}
                                        className="contact-number"
                                        itemProp="telephone"
                                    >
                                        {property.Contact_no1 || property.contact_no || 'Not provided'}
                                    </a>
                                </div>
                                {property.Contact_no2 && property.Contact_no2 !== property.Contact_no1 && (
                                    <div className="contact-info secondary">
                                        <span className="contact-label">Secondary contact:</span>
                                        <a
                                            href={`tel:${property.Contact_no2}`}
                                            className="contact-number"
                                            itemProp="telephone"
                                        >
                                            {property.Contact_no2}
                                        </a>
                                    </div>
                                )}
                                {property.email && (
                                    <div className="contact-info secondary">
                                        <span className="contact-label">Email:</span>
                                        <a
                                            href={`mailto:${property.email}`}
                                            className="contact-number"
                                            itemProp="email"
                                        >
                                            {property.email}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Image Modal */}
            {showFullImage && property.image && (
                <div className="full-image-modal" onClick={handleCloseFullImage}>
                    <div className="full-image-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="close-full-image"
                            onClick={handleCloseFullImage}
                            aria-label="Close full screen image"
                        >
                            ×
                        </button>
                        <img
                            src={property.image[activeImageIndex]}
                            alt={`Full screen view of ${property.location}`}
                        />
                        {property.image.length > 1 && (
                            <div className="full-image-nav">
                                <button
                                    className="nav-button prev"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage('prev');
                                    }}
                                    aria-label="Previous image"
                                >
                                    &lt;
                                </button>
                                <span className="image-counter">
                                    {activeImageIndex + 1} / {property.image.length}
                                </span>
                                <button
                                    className="nav-button next"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage('next');
                                    }}
                                    aria-label="Next image"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyDetail;