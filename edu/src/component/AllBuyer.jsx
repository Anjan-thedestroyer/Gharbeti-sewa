import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import './AllBuyer.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AllBuyer = () => {
    const [buyers, setBuyers] = useState([]);
    const [displayedBuyers, setDisplayedBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const itemsPerPage = 7;

    const fetchBuyers = useCallback(async () => {
        try {
            const response = await axiosInstance('/buyers/get');
            console.log(response.data)
            setBuyers(response.data.data);
            setDisplayedBuyers(response.data.data.slice(0, itemsPerPage));
            setHasMore(response.data.data.length > itemsPerPage);
        } catch (error) {
            console.error('Error fetching buyers:', error);
            setError('Failed to fetch buyer data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBuyers();
    }, [fetchBuyers]);

    const loadMore = () => {
        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * itemsPerPage;
        const newBuyers = buyers.slice(startIndex, startIndex + itemsPerPage);

        if (newBuyers.length > 0) {
            setDisplayedBuyers(prev => [...prev, ...newBuyers]);
            setPage(nextPage);
            setHasMore(startIndex + itemsPerPage < buyers.length);
        }
    };

    const toggleMenu = (e, buyerId) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(menuOpen === buyerId ? null : buyerId);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const closeMenu = () => {
        setMenuOpen(null);
    };

    const handleDelete = async (buyerId) => {
        try {
            await axiosInstance.delete(`/buyers/delete-buyer/${buyerId}`);
            setBuyers(prev => prev.filter(b => b._id !== buyerId));
            setDisplayedBuyers(prev => prev.filter(b => b._id !== buyerId));
        } catch (err) {
            console.error('Error deleting buyer:', err);
            alert('Failed to delete buyer. Please try again.');
        }
        closeMenu();
    };

    const handleMarkAsComplete = async (buyerId) => {
        try {
            await axiosInstance.put(`/buyers/mark-buyer/${buyerId}`);
            setBuyers(prev => prev.filter(b => b._id !== buyerId));
            setDisplayedBuyers(prev => prev.filter(b => b._id !== buyerId));
        } catch (err) {
            console.error('Error marking as complete:', err);
            alert('Failed to update buyer status. Please try again.');
        }
        closeMenu();
    };

    useEffect(() => {
        const handleClickOutside = () => closeMenu();
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const renderPropertyDetails = (property) => {
        if (!property) return null;

        return (
            <div className="all-buyers-property-details">
                <div className="all-buyers-property-header">
                    <h4>{property.name}</h4>
                    {property.verified && <span className="all-buyers-verified-badge">Verified</span>}
                </div>
                <div className="all-buyers-property-grid">
                    <div className="all-buyers-property-info">
                        <div className="all-buyers-info-row">
                            <span className="all-buyers-info-label">Location:</span>
                            <span>{property.location}</span>
                        </div>
                        <div className="all-buyers-info-row">
                            <span className="all-buyers-info-label">Price:</span>
                            <span>NPR {property.pricing || property.price}</span>
                        </div>
                        <div className="all-buyers-info-row">
                            <span className="all-buyers-info-label">Applicants:</span>
                            <span>{property.Applicants || 0}</span>
                        </div>

                        {(property.contact_no || property.Contact_no1) && (
                            <div className="all-buyers-info-row">
                                <span className="all-buyers-info-label">Contact:</span>
                                <span>{property.contact_no || property.Contact_no1}</span>
                            </div>
                        )}

                        {property.Contact_no2 && (
                            <div className="all-buyers-info-row">
                                <span className="all-buyers-info-label">Secondary Contact:</span>
                                <span>{property.Contact_no2}</span>
                            </div>
                        )}
                    </div>

                    {property.image?.length > 0 && (
                        <div className="all-buyers-property-image-container">
                            <img
                                src={property.image[0]}
                                alt={property.name}
                                className="all-buyers-property-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.jpg';
                                }}
                            />
                        </div>
                    )}
                </div>

                {property.description && (
                    <div className="all-buyers-property-description">
                        <div className="all-buyers-info-row">
                            <span className="all-buyers-info-label">Description:</span>
                            <span>{property.description}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) return (
        <div className="all-buyers-loading-container">
            <div className="all-buyers-loading-spinner"></div>
        </div>
    );

    if (error) return <div className="all-buyers-error-message">{error}</div>;
    if (!buyers.length) return <div className="all-buyers-empty-state">No buyer applications found</div>;

    return (
        <div className="all-buyers-dashboard">
            <header className="all-buyers-dashboard-header">
                <button onClick={handleBack} className="all-buyers-back-button">
                    <FiArrowLeft size={24} />
                </button>
                <div className="all-buyers-header-content">
                    <h1>Buyer Applications</h1>
                    <p className="all-buyers-subtitle">Showing {displayedBuyers.length} of {buyers.length} applications</p>
                </div>
            </header>

            <div className="all-buyers-grid">
                {displayedBuyers.map((buyer) => (
                    <div key={buyer._id} className="all-buyers-card">
                        <div className="all-buyers-header">
                            <div className="all-buyers-title">
                                <h3>{buyer.name}</h3>
                                <span className="all-buyers-timestamp">
                                    Applied on {new Date(buyer.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="all-buyers-actions">
                                <button
                                    onClick={(e) => toggleMenu(e, buyer._id)}
                                    className="all-buyers-action-button"
                                    aria-label="Actions"
                                >
                                    <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="2" cy="2" r="2" fill="#6B7280" />
                                        <circle cx="8" cy="2" r="2" fill="#6B7280" />
                                        <circle cx="14" cy="2" r="2" fill="#6B7280" />
                                    </svg>
                                </button>

                                {menuOpen === buyer._id && (
                                    <div className="all-buyers-action-menu">
                                        <button onClick={() => handleMarkAsComplete(buyer._id)}>
                                            Mark as Complete
                                        </button>
                                        <button onClick={() => handleDelete(buyer._id)}>
                                            Remove Application
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="all-buyers-content">
                            <div className="all-buyers-detail-section">
                                <h4 className="all-buyers-section-title">Contact Information</h4>
                                <div className="all-buyers-info-row">
                                    <span className="all-buyers-info-label">Phone:</span>
                                    <span>{buyer.phone}</span>
                                </div>
                            </div>

                            <div className="all-buyers-detail-section">
                                <h4 className="all-buyers-section-title">Requirements</h4>
                                <div className="all-buyers-requirements-grid">
                                    <div className="all-buyers-requirement-item">
                                        <span className="all-buyers-info-label">Rooms</span>
                                        <span className="all-buyers-info-value">{buyer.No_of_rooms}</span>
                                    </div>
                                    <div className="all-buyers-requirement-item">
                                        <span className="all-buyers-info-label">People</span>
                                        <span className="all-buyers-info-value">{buyer.No_of_people}</span>
                                    </div>
                                </div>
                                {buyer.location && (
                                    <div className="all-buyers-info-row">
                                        <span className="all-buyers-info-label">Preferred Location:</span>
                                        <span>{buyer.location}</span>
                                    </div>
                                )}
                            </div>

                            {buyer.hostel && (
                                <div className="all-buyers-detail-section">
                                    <h4 className="all-buyers-section-title">Hostel Information</h4>
                                    {renderPropertyDetails(buyer.hostel)}
                                </div>
                            )}

                            {buyer.rent_room && (
                                <div className="all-buyers-detail-section">
                                    <h4 className="all-buyers-section-title">Rental Information</h4>
                                    {renderPropertyDetails(buyer.rent_room)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="all-buyers-load-more-container">
                    <button onClick={loadMore} className="all-buyers-load-more-button">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllBuyer;