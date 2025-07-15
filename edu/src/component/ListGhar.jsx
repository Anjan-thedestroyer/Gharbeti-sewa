import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import './ListGhar.css';
import { useEffect } from 'react';
import PropertyDetail from './PropertyDetail';
import { useParams } from 'react-router-dom';

const ListGhar = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lands, setLands] = useState([]);
    const [sortPrice, setSortPrice] = useState(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [ids, setId] = useState("")
    const [isHostel, setIsHostel] = useState(false)

    useEffect(() => {
        if (data) {
            searchByAddress(data);
        }
    }, [data]);
    const { id } = useParams()
    useEffect(() => {
        const flag = id === "hostel";
        console.log("isHostel:", flag);
        setIsHostel(flag);

    }, [id]);
    const searchByAddress = async (location) => {
        setLoading(true);
        setError("");
        setLands([]);
        setSortPrice(null);
        setSelectedPropertyId(null);

        try {
            const url = isHostel ? '/hostels/by-address' : '/landlords/verified/by-address'
            const response = await axiosInstance.get(url, {
                params: { location }
            });
            console.log(response.data.data)
            setLands(response.data.data);
        } catch (error) {
            console.error("Search error:", error);
            setError("Failed to fetch properties. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSortByPrice = (order) => {
        if (lands.length === 0) return;

        setLands(prevLands => {
            const sortedLands = [...prevLands].sort((a, b) => {
                const priceA = a.pricing || 0;
                const priceB = b.pricing || 0;
                return order === 1 ? priceA - priceB : priceB - priceA;
            });
            return sortedLands;
        });

        setSortPrice(order);
    };

    const handlePropertyClick = (propertyId) => {
        setSelectedPropertyId(propertyId);
    };

    const handleCloseDetail = () => {
        setSelectedPropertyId(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateArea = (width, length) => {
        if (width && length) return width * length;
        return null;
    };

    return (
        <div className="list-ghar-container">
            {error && <div className="error-message">{error}</div>}

            <div className="sort-options">
                <span className="sort-label">Sort by price:</span>
                <button
                    onClick={() => handleSortByPrice(1)}
                    className={`sort-button ${sortPrice === 1 ? 'active' : ''}`}
                >
                    Ascending
                </button>
                <button
                    onClick={() => handleSortByPrice(-1)}
                    className={`sort-button ${sortPrice === -1 ? 'active' : ''}`}
                >
                    Descending
                </button>
            </div>

            <div className="results-container">
                {loading ? (
                    <div className="loading-spinner">Loading properties...</div>
                ) : lands.length > 0 ? (
                    <div className="property-grid">
                        {lands.map(land => {
                            const area = calculateArea(land.width, land.length);
                            return (
                                <div
                                    key={land._id}
                                    className="property-card"
                                    onClick={() => handlePropertyClick(land._id)}
                                >
                                    <div className="property-image-container">
                                        {land.image && land.image.length > 0 ? (
                                            <img
                                                src={land.image[0]}
                                                alt={land.location}
                                                className="property-image"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/600x400?text=Property+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="property-image-placeholder">
                                                Image not available
                                            </div>
                                        )}
                                        <div className="property-status">
                                            {land.sold && <span className="status-badge sold">Sold</span>}
                                            {land.verified && <span className="status-badge verified">Verified</span>}
                                        </div>
                                    </div>
                                    <div className="property-details">
                                        <div className="property-header">
                                            <h3 className="property-location">{land.location}</h3>
                                            <div className="property-price">Rs. {land.pricing?.toLocaleString() || land.price || 'Price on request'}</div>
                                        </div>

                                        <div className="property-meta">
                                            <div className="meta-item">
                                                <span className="meta-label">Listed by:</span>
                                                <span className="meta-value">{land.name || 'Owner'}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-label">Posted:</span>
                                                <span className="meta-value">{formatDate(land.createdAt)}</span>
                                            </div>
                                        </div>

                                        <div className="property-description">
                                            {land.description || 'No detailed description provided for this property.'}
                                        </div>

                                        <div className="property-specs">
                                            <div className="specs-grid">
                                                {land.room || land.Rooms !== 0 && (
                                                    <div className="spec-item">
                                                        <span className="spec-value">{land.room || land.Rooms}</span>
                                                        <span className="spec-label">Room</span>
                                                    </div>
                                                )}
                                                {land.bathroom && (
                                                    <div className="spec-item">
                                                        <span className="spec-value">{land.bathroom}</span>
                                                        <span className="spec-label">Bathrooms</span>
                                                    </div>
                                                )}

                                                {area && (
                                                    <div className="spec-item">
                                                        <span className="spec-value">{area} sq.ft.</span>
                                                        <span className="spec-label">Total Area</span>
                                                    </div>
                                                )}
                                                {land.width && land.length && (
                                                    <div className="spec-item">
                                                        <span className="spec-value">{land.width} × {land.length}</span>
                                                        <span className="spec-label">Dimensions</span>
                                                    </div>
                                                )}
                                                {land.Applicants !== 0 && (
                                                    <div className="spec-item">
                                                        <span className="spec-value">{land.Applicants}</span>
                                                        <span className="spec-label">Number of people applied</span>

                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="property-contact">
                                            <div className="contact-info">
                                                <span className="contact-label">Primary contact:</span>
                                                <a
                                                    href={`tel:${land.contact_no}`}
                                                    className="contact-number"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {land.Contact_no1 || land.contact_no || 'Not provided'}
                                                </a>
                                            </div>
                                            {land.Contact_no2 && land.Contact_no2 !== land.Contact_no1 && (
                                                <div className="contact-info secondary">
                                                    <span className="contact-label">Secondary contact:</span>
                                                    <a
                                                        href={`tel:${land.Contact_no2}`}
                                                        className="contact-number"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {land.Contact_no2}
                                                    </a>
                                                </div>
                                            )}
                                            {land.email !== 0 && (
                                                <div className="contact-info secondary">
                                                    <span className="contact-label">Secondary contacts:</span>
                                                    <a
                                                        href={`tel:${land.email}`}
                                                        className="contact-number"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {land.email}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-results">
                        {data
                            ? "No properties currently available in this location"
                            : "Enter a location to search for properties"}
                    </div>
                )}
            </div>

            {selectedPropertyId && (
                <PropertyDetail
                    propertyId={selectedPropertyId}
                    onClose={handleCloseDetail}
                    type={id}
                />
            )}
        </div>
    );
};

export default ListGhar;