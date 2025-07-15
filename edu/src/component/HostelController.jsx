import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import './HostelController.css';
import { useNavigate } from 'react-router-dom';

const HostelController = () => {
    const navigate = useNavigate();

    const [hostels, setHostels] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(null);

    useEffect(() => {
        const fetchHostelData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/user/get-hostel');
                setHostels(response.data.data || []);
                console.log(hostels);

            } catch (err) {
                console.error('Error fetching hostels:', err);
                setError("Failed to fetch hostel data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchHostelData();
    }, []);

    const calculateArea = (width, length) => {
        return width && length ? width * length : null;
    };

    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    };

    const handlePropertyClick = (id, e) => {
        if (e.target.closest('.hostel-menu')) return;
        console.log("Hostel selected:", id);
    };

    const toggleMenu = (id, e) => {
        e.stopPropagation();
        setMenuOpen(menuOpen === id ? null : id);
    };

    const closeMenu = () => {
        setMenuOpen(null);
    };

    const handleDelete = async (id) => {
        try {
            console.log(id);
            await axiosInstance.delete(`/hostels/delete-hostel/${id}`);
            setHostels(hostels.filter(hostel => hostel._id !== id));
        } catch (err) {
            console.error('Error deleting hostel:', err);
            alert("Failed to delete hostel. Please try again.");
        }
        closeMenu();
    }



    const handleEdit = async (id) => {
        try {
            await navigate(`/edit-details/${id}`)

        } catch (error) {
            console.error('Error navigating to edit page:', error);
        }
    };

    const handleEditImage = async (id) => {

        try {
            await navigate(`/edit-image/${id}`)

        } catch (err) {
            console.error('Error navigating to edit page:', error);

        }

        closeMenu();
    };

    useEffect(() => {
        const handleClickOutside = () => closeMenu();
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading hostels...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (hostels.length === 0) {
        return (
            <div className="empty-state">
                <img
                    src="/images/no-hostels.svg"
                    alt="No hostels found"
                    className="empty-state-image"
                />
                <h3>No hostels listed yet</h3>
                <p>Check back later or list your own hostel</p>
            </div>
        );
    }

    return (
        <div className="hostel-grid">
            {hostels.map((hostel) => {
                const area = calculateArea(hostel.width, hostel.length);

                return (
                    <article
                        key={hostel._id}
                        className="hostel-card"
                        onClick={(e) => handlePropertyClick(hostel._id, e)}
                        aria-label={`Hostel in ${hostel.location}`}
                    >
                        <div className="hostel-image-container">
                            {hostel.image?.length > 0 ? (
                                <img
                                    src={hostel.image[0]}
                                    alt={`Hostel in ${hostel.location}`}
                                    className="hostel-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/hostel-placeholder.jpg';
                                    }}
                                />
                            ) : (
                                <div className="image-placeholder">
                                    <span>Image not available</span>
                                </div>
                            )}
                            <div className="status-badges">
                                {hostel.sold && <span className="badge sold">Sold</span>}
                                {hostel.verified && <span className="badge verified">Verified</span>}
                            </div>
                        </div>

                        <div className="hostel-details">
                            <header className="hostel-header">
                                <h3 className="hostel-location">
                                    {hostel.location || "Location not specified"}
                                </h3>
                                <div className="hostel-price">
                                    Rs. {hostel.price?.toLocaleString() || "Price on request"}
                                </div>
                            </header>

                            <div className="hostel-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Listed by:</span>
                                    <span className="meta-value">{hostel.name || 'Owner'}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Posted:</span>
                                    <span className="meta-value">{formatDate(hostel.createdAt)}</span>
                                </div>
                            </div>

                            <p className="hostel-description">
                                {hostel.description || 'No detailed description provided.'}
                            </p>

                            <div className="hostel-specs">
                                <div className="specs-grid">
                                    {hostel.bathroom && (
                                        <div className="spec-item">
                                            <span className="spec-value">{hostel.bathroom}</span>
                                            <span className="spec-label">Bathrooms</span>
                                        </div>
                                    )}
                                    {area && (
                                        <div className="spec-item">
                                            <span className="spec-value">{area} sq.ft.</span>
                                            <span className="spec-label">Area</span>
                                        </div>
                                    )}
                                    {hostel.width && hostel.length && (
                                        <div className="spec-item">
                                            <span className="spec-value">
                                                {hostel.width} × {hostel.length}
                                            </span>
                                            <span className="spec-label">Dimensions</span>
                                        </div>
                                    )}
                                    {hostel.Applicants > 0 && (
                                        <div className="spec-item">
                                            <span className="spec-value">{hostel.Applicants}</span>
                                            <span className="spec-label">Applicants</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="hostel-contact-container">
                                <div className="hostel-contact">
                                    <div className="contact-item">
                                        <span className="contact-label">Contact:</span>
                                        <a
                                            href={`tel:${hostel.contact_no
                                                }`}
                                            className="contact-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {hostel.contact_no || 'Not provided'}
                                        </a>
                                    </div>

                                </div>

                                <div className="hostel-menu-container">
                                    <button
                                        className="hostel-menu-button"
                                        onClick={(e) => toggleMenu(hostel._id, e)}
                                        aria-label="Hostel options"
                                    >
                                        <span className="menu-dots">⋯</span>
                                    </button>

                                    {menuOpen === hostel._id && (
                                        <div className="hostel-menu-dropdown">
                                            <button
                                                className="menu-item"
                                                onClick={() => handleEdit(hostel._id)}
                                            >
                                                Edit Hostel
                                            </button>
                                            <button
                                                className="menu-item"
                                                onClick={() => handleEditImage(hostel._id)}
                                            >
                                                Edit Images
                                            </button>
                                            <button
                                                className="menu-item "
                                                onClick={() => handleDelete(hostel._id)}
                                            >
                                                Add food menu
                                            </button>
                                            <button
                                                className="menu-item delete"
                                                onClick={() => handleDelete(hostel._id)}
                                            >
                                                Delete Hostel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

export default HostelController;