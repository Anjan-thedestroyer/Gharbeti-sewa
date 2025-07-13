import React, { useState, useEffect, createContext, useContext } from 'react';
import axiosInstance from '../utils/axios';
import './PropertyDetail.css';
import { useNavigate } from 'react-router-dom';

// const DataContext = createContext("landlord");
// export const usedata = () => useContext(DataContext)
const PropertyDetail = ({ propertyId, onClose, type }) => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showFullImage, setShowFullImage] = useState(false);
    const [isHostel, setIsHostel] = useState(false)
    const navigate = useNavigate()
    const handleApply = async (_id) => {
        await localStorage.setItem('myData', JSON.stringify({ data: 'Landlord' }));
        navigate(`/apply/${_id}`)
    }



    useEffect(() => {
        const fetchPropertyDetails = async () => {
            setLoading(true);
            try {
                const isHostelType = type === 'hostel'; // evaluate immediately
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


    const handleThumbnailClick = (index, e) => {
        e.stopPropagation();
        setActiveImageIndex(index);
    };

    const handleMainImageClick = () => {
        if (property.image && property.image.length > 0) {
            setShowFullImage(true);
        }
    };

    const handleCloseFullImage = () => {
        setShowFullImage(false);
    };

    const navigateImage = (direction) => {
        if (!property.image) return;

        if (direction === 'prev') {
            setActiveImageIndex(prev =>
                prev === 0 ? property.image.length - 1 : prev - 1
            );
        } else {
            setActiveImageIndex(prev =>
                prev === property.image.length - 1 ? 0 : prev + 1
            );
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateArea = (width, length) => {
        if (width && length) return width * length;
        return null;
    };

    if (loading) {
        return (
            <div className="property-detail-overlay">
                <div className="property-detail-container">
                    <button className="close-button" onClick={onClose}>×</button>
                    <div className="loading-spinner">Loading property details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="property-detail-overlay">
                <div className="property-detail-container">
                    <button className="close-button" onClick={onClose}>×</button>
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    if (!property) {
        return null;
    }

    const area = calculateArea(property.width, property.length);

    return (
        <>
            <div className="property-detail-overlay" onClick={onClose}>
                <div className="property-detail-container" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={onClose}>×</button>

                    <div className="property-detail-content">
                        {/* Image Gallery */}
                        <div className="image-gallery">
                            <div
                                className={`main-image ${property.image && property.image.length > 0 ? 'clickable' : ''}`}
                                onClick={handleMainImageClick}
                            >
                                {property.image && property.image.length > 0 ? (
                                    <img
                                        src={property.image[activeImageIndex]}
                                        alt={`Property ${activeImageIndex + 1}`}
                                    />
                                ) : (
                                    <div className="image-placeholder">No Image Available</div>
                                )}
                            </div>
                            {property.image && property.image.length > 1 && (
                                <div className="thumbnail-container">
                                    {property.image.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                                            onClick={(e) => handleThumbnailClick(index, e)}
                                        >
                                            <img src={img} alt={`Thumbnail ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <p onClick={() => handleApply(property._id)} className="status-badge1 verified">APPLY NOW</p>
                        <div className="property-info">
                            <div className="property-header">
                                <h1>{property.location}</h1>
                                <div className="price">Rs. {property.pricing?.toLocaleString() || 'Price on request'}</div>
                                <div className="status-badges">
                                    {property.sold && <span className="status-badge sold">Sold</span>}
                                    {property.verified && <span className="status-badge verified">Verified</span>}
                                </div>
                            </div>

                            <div className="property-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Listed by:</span>
                                    <span className="meta-value">{property.name || 'Owner'}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Posted:</span>
                                    <span className="meta-value">{formatDate(property.createdAt)}</span>
                                </div>
                            </div>

                            <div className="property-description">
                                <h3>Description</h3>
                                <p>{property.description || 'No detailed description provided for this property.'}</p>
                            </div>

                            <div className="property-specs">
                                <h3>Specifications</h3>
                                <div className="specs-grid">
                                    {property.bathroom && (
                                        <div className="spec-item">
                                            <span className="spec-value">{property.bathroom}</span>
                                            <span className="spec-label">Bathrooms</span>
                                        </div>
                                    )}
                                    {area && (
                                        <div className="spec-item">
                                            <span className="spec-value">{area} sq.ft.</span>
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
                                            <span className="spec-label">Number of people applied</span>

                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="property-contact">
                                <h3>Contact Information</h3>
                                <div className="contact-info">
                                    <span className="contact-label">Primary contact:</span>
                                    <a href={`tel:${property.Contact_no1}`} className="contact-number">
                                        {property.Contact_no1 || 'Not provided'}
                                    </a>
                                </div>
                                {property.Contact_no2 && property.Contact_no2 !== property.Contact_no1 && (
                                    <div className="contact-info secondary">
                                        <span className="contact-label">Secondary contact:</span>
                                        <a href={`tel:${property.Contact_no2}`} className="contact-number">
                                            {property.Contact_no2}
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
                        <button className="close-full-image" onClick={handleCloseFullImage}>×</button>
                        <img
                            src={property.image[activeImageIndex]}
                            alt={`Property ${activeImageIndex + 1}`}
                        />
                        {property.image.length > 1 && (
                            <div className="full-image-nav">
                                <button
                                    className="nav-button prev"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage('prev');
                                    }}
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