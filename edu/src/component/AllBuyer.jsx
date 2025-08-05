import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import './AllBuyer.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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

    const pageTitle = "Buyer Applications Management | Gharbeti-sewa";
    const pageDescription = "View and manage all buyer applications for hostels and rental properties in one place.";

    const fetchBuyers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance('/buyers/get');
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

    const loadMore = useCallback(() => {
        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * itemsPerPage;
        const newBuyers = buyers.slice(startIndex, startIndex + itemsPerPage);

        if (newBuyers.length > 0) {
            setDisplayedBuyers(prev => [...prev, ...newBuyers]);
            setPage(nextPage);
            setHasMore(startIndex + itemsPerPage < buyers.length);
        }
    }, [page, buyers]);

    const toggleMenu = useCallback((e, buyerId) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(menuOpen === buyerId ? null : buyerId);
    }, [menuOpen]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const closeMenu = useCallback(() => {
        setMenuOpen(null);
    }, []);

    const handleDelete = useCallback(async (buyerId) => {
        try {
            await axiosInstance.delete(`/buyers/delete-buyer/${buyerId}`);
            setBuyers(prev => prev.filter(b => b._id !== buyerId));
            setDisplayedBuyers(prev => prev.filter(b => b._id !== buyerId));
        } catch (err) {
            console.error('Error deleting buyer:', err);
            alert('Failed to delete buyer. Please try again.');
        }
        closeMenu();
    }, [closeMenu]);

    const handleMarkAsComplete = useCallback(async (buyerId) => {
        try {
            await axiosInstance.put(`/buyers/mark-buyer/${buyerId}`);
            setBuyers(prev => prev.filter(b => b._id !== buyerId));
            setDisplayedBuyers(prev => prev.filter(b => b._id !== buyerId));
        } catch (err) {
            console.error('Error marking as complete:', err);
            alert('Failed to update buyer status. Please try again.');
        }
        closeMenu();
    }, [closeMenu]);

    useEffect(() => {
        const handleClickOutside = () => closeMenu();
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [closeMenu]);

    const renderPropertyDetails = useCallback((property) => {
        if (!property) return null;

        return (
            <div className="all-buyers-property-details">
                <div className="all-buyers-property-header">
                    <h3>{property.name}</h3>
                    {property.verified && (
                        <span className="all-buyers-verified-badge" aria-label="Verified property">
                            Verified
                        </span>
                    )}
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
                                alt={`${property.name} property`}
                                className="all-buyers-property-image"
                                loading="lazy"
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
    }, []);

    if (loading) return (
        <div className="all-buyers-loading-container" aria-live="polite" aria-busy="true">
            <div className="all-buyers-loading-spinner"></div>
            <span className="visually-hidden">Loading buyer applications...</span>
        </div>
    );

    if (error) return (
        <div className="all-buyers-error-message" role="alert">
            {error}
        </div>
    );

    if (!buyers.length) return (
        <div className="all-buyers-empty-state">
            No buyer applications found
        </div>
    );

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": pageTitle,
                        "description": pageDescription,
                        "publisher": {
                            "@type": "Organization",
                            "name": "Your Platform Name"
                        }
                    })}
                </script>
            </Helmet>

            <div className="all-buyers-dashboard">
                <header className="all-buyers-dashboard-header">
                    <button
                        onClick={handleBack}
                        className="all-buyers-back-button"
                        aria-label="Go back"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <div className="all-buyers-header-content">
                        <h1>Buyer Applications</h1>
                        <p className="all-buyers-subtitle">
                            Showing <span data-testid="displayed-count">{displayedBuyers.length}</span> of{' '}
                            <span data-testid="total-count">{buyers.length}</span> applications
                        </p>
                    </div>
                </header>

                <main className="all-buyers-grid">
                    {displayedBuyers.map((buyer) => (
                        <article key={buyer._id} className="all-buyers-card">
                            <div className="all-buyers-header">
                                <div className="all-buyers-title">
                                    <h2>{buyer.name}</h2>
                                    <time
                                        className="all-buyers-timestamp"
                                        dateTime={new Date(buyer.createdAt).toISOString()}
                                    >
                                        Applied on {new Date(buyer.createdAt).toLocaleDateString()}
                                    </time>
                                </div>
                                <div className="all-buyers-actions">
                                    <button
                                        onClick={(e) => toggleMenu(e, buyer._id)}
                                        className="all-buyers-action-button"
                                        aria-label={`Actions for ${buyer.name}`}
                                        aria-expanded={menuOpen === buyer._id}
                                    >
                                        <svg width="16" height="4" viewBox="0 0 16 4" aria-hidden="true">
                                            <circle cx="2" cy="2" r="2" />
                                            <circle cx="8" cy="2" r="2" />
                                            <circle cx="14" cy="2" r="2" />
                                        </svg>
                                    </button>

                                    {menuOpen === buyer._id && (
                                        <div
                                            className="all-buyers-action-menu"
                                            role="menu"
                                            aria-labelledby={`actions-menu-${buyer._id}`}
                                        >
                                            <button
                                                onClick={() => handleMarkAsComplete(buyer._id)}
                                                role="menuitem"
                                            >
                                                Mark as Complete
                                            </button>
                                            <button
                                                onClick={() => handleDelete(buyer._id)}
                                                role="menuitem"
                                            >
                                                Remove Application
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="all-buyers-content">
                                <section className="all-buyers-detail-section">
                                    <h3 className="all-buyers-section-title">Contact Information</h3>
                                    <div className="all-buyers-info-row">
                                        <span className="all-buyers-info-label">Phone:</span>
                                        <span>{buyer.phone}</span>
                                    </div>
                                    <div className="all-buyers-info-row">
                                        <span className="all-buyers-info-label">Email:</span>
                                        <span>{buyer.email}</span>
                                    </div>
                                </section>

                                <section className="all-buyers-detail-section">
                                    <h3 className="all-buyers-section-title">Requirements</h3>
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
                                </section>

                                {buyer.hostel && (
                                    <section className="all-buyers-detail-section">
                                        <h3 className="all-buyers-section-title">Hostel Information</h3>
                                        {renderPropertyDetails(buyer.hostel)}
                                    </section>
                                )}

                                {buyer.rent_room && (
                                    <section className="all-buyers-detail-section">
                                        <h3 className="all-buyers-section-title">Rental Information</h3>
                                        {renderPropertyDetails(buyer.rent_room)}
                                    </section>
                                )}
                            </div>
                        </article>
                    ))}
                </main>

                {hasMore && (
                    <div className="all-buyers-load-more-container">
                        <button
                            onClick={loadMore}
                            className="all-buyers-load-more-button"
                            aria-label="Load more applications"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default AllBuyer;