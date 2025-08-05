import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../utils/axios';
import './FreelancerList.css';
import { FaTimes, FaCheck, FaMapMarkerAlt, FaEnvelope, FaTasks } from 'react-icons/fa';
import { RiUserStarFill } from 'react-icons/ri';
import Assign from './Assign';

const FreelancerList = ({ id, location }) => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFreelancers, setSelectedFreelancers] = useState([]);
    const modalRef = useRef();

    useEffect(() => {
        console.log(location)
        const fetchFreelancers = async () => {
            try {
                const res = await axiosInstance.get('/freelance/verified-location', { params: { location } });
                setFreelancers(res.data?.data || []);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch freelancers', err);
                setError('Failed to load freelancers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFreelancers();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModalOpen(false);
            }
        };

        if (modalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalOpen]);

    const toggleFreelancerSelection = (freelancerId) => {
        setSelectedFreelancers(prev => {
            if (prev.includes(freelancerId)) {
                return prev.filter(id => id !== freelancerId);
            } else {
                return [...prev, freelancerId];
            }
        });
    };

    const handleAssignMultiple = () => {
        if (selectedFreelancers.length === 0) {
            setError('Please select at least one freelancer');
            return;
        }
        setModalOpen(true);
    };

    const clearSelection = () => {
        setSelectedFreelancers([]);
    };

    return (
        <div className="professional-freelancer-container">
            <section className="freelancer-list" aria-labelledby="freelancer-list-heading">
                <header className="freelancer-list__header">
                    <div className="header-content">
                        <RiUserStarFill className="header-icon" />
                        <div>
                            <h1 id="freelancer-list-heading" className="freelancer-list__title">
                                Verified Professionals
                            </h1>
                            <p className="freelancer-list__subtitle">
                                Browse our exclusive network of top-tier professionals
                            </p>
                        </div>
                    </div>

                    {selectedFreelancers.length > 0 && (
                        <div className="multi-assign-controls">
                            <div className="selection-counter">
                                <FaCheck className="check-icon" />
                                <span>{selectedFreelancers.length} selected</span>
                            </div>
                            <div className="action-buttons">
                                <button
                                    onClick={clearSelection}
                                    className="clear-selection-btn"
                                >
                                    Clear Selection
                                </button>
                                <button
                                    onClick={handleAssignMultiple}
                                    className="assign-multiple-btn"
                                >
                                    Assign to Selected
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                <div className="freelancer-list__content">
                    {loading ? (
                        <div className="loading-indicator">
                            <div className="spinner"></div>
                            <span>Loading professionals...</span>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <div className="error-content">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : freelancers.length > 0 ? (
                        <div className="freelancer-grid">
                            {freelancers.map(freelancer => (
                                <div
                                    key={freelancer._id}
                                    className={`freelancer-card ${selectedFreelancers.includes(freelancer._id) ? 'selected' : ''}`}
                                    onClick={() => toggleFreelancerSelection(freelancer._id)}
                                >
                                    <div className="card-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedFreelancers.includes(freelancer._id)}
                                            onChange={() => toggleFreelancerSelection(freelancer._id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="card-content">
                                        <div className="avatar-container">
                                            <div
                                                className="freelancer-avatar"
                                                style={{
                                                    backgroundColor: stringToColor(freelancer.name),
                                                    backgroundImage: `linear-gradient(135deg, ${stringToColor(freelancer.name)}, ${stringToDarkColor(freelancer.name)})`
                                                }}
                                            >
                                                {freelancer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="verification-badge">
                                                <RiUserStarFill />
                                            </div>
                                        </div>
                                        <div className="freelancer-info">
                                            <h3 className="freelancer-name">{freelancer.name}</h3>
                                            <div className="freelancer-meta">
                                                <div className="meta-item">
                                                    <FaEnvelope className="meta-icon" />
                                                    <span>{freelancer.email}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <FaMapMarkerAlt className="meta-icon" />
                                                    <span>{freelancer.location || 'Remote'}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <FaTasks className="meta-icon" />
                                                    <span>{freelancer.task.length} tasks</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="assign-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFreelancers([freelancer._id]);
                                                setModalOpen(true);
                                            }}
                                        >
                                            Assign
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-content">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h3>No Professionals Available</h3>
                                <p>Our network is currently fully engaged. Please check back later.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Premium Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div ref={modalRef} className="modal-container">
                        <div className="modal-header">
                            <div className="modal-title">
                                <RiUserStarFill className="modal-icon" />
                                <h3>
                                    {selectedFreelancers.length > 1
                                        ? `Assign Project to ${selectedFreelancers.length} `
                                        : 'Assign Project'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="modal-close-btn"
                                aria-label="Close modal"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-content">
                            <Assign
                                freelancerIds={selectedFreelancers}
                                RoomId={id}
                                onClose={() => {
                                    setModalOpen(false);
                                    setSelectedFreelancers([]);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 85%, 65%)`;
}

function stringToDarkColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 85%, 45%)`;
}

export default FreelancerList;