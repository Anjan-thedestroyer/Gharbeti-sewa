import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { Helmet } from 'react-helmet';
import './free.css'
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
const ListFreelancer = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate()
    useEffect(() => {
        const GetData = async () => {
            try {
                const response = await axiosInstance.get('/freelance/unverified');
                setData(response.data?.data || []);
            } catch (err) {
                setError("Failed to fetch freelancers. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        GetData();
    }, []);

    // Filter freelancers based on search term
    const filteredFreelancers = data.filter(freelancer =>
        freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFreelancers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFreelancers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleVerify = async (id) => {
        try {
            await axiosInstance.put(`/freelance/verify/${id}`)
            setData(data.filter(freelancer => freelancer._id !== id))
        } catch (error) {
            console.error(error);
        }
    }
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/freelance/delete/${id}`)
            setData(data.filter(freelancer => freelancer._id !== id))
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading freelancers...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
                Retry
            </button>
        </div>
    );

    return (
        <div className="freelancer-container">
            <Helmet>
                <title>Unverified Freelancers | Admin Dashboard</title>
                <meta
                    name="description"
                    content="Manage unverified freelancers awaiting approval. View profiles, contact information, and verification requests."
                />
                <meta name="keywords" content="freelancers, verification, admin, dashboard, manage" />
            </Helmet>

            <header className="freelancer-header">
                <span onClick={() => navigate(-1)}><FiArrowLeft size={40} /></span>
                <h1>Unverified Freelancers</h1>
                <p className="subtitle">
                    Review and manage freelancers awaiting verification ({filteredFreelancers.length} pending)
                </p>
            </header>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="search-input"
                />
            </div>

            {currentItems.length === 0 ? (
                <div className="no-results">
                    <p>No freelancers found matching your criteria.</p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="clear-search-button"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="freelancer-grid">
                        {currentItems.map((freelancer) => (
                            <div key={freelancer._id} className="freelancer-card">
                                <div className="freelancer-header">
                                    <h3>{freelancer.name}</h3>
                                    <span className="status-badge unverified">Unverified</span>
                                </div>
                                <div className="freelancer-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Email:</span>
                                        <a href={`mailto:${freelancer.email}`} className="detail-value">
                                            {freelancer.email}
                                        </a>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Phone:</span>
                                        <a href={`tel:${freelancer.phone}`} className="detail-value">
                                            {freelancer.phone}
                                        </a>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{freelancer.location}</span>
                                    </div>
                                    {freelancer.message && (
                                        <div className="detail-item">
                                            <span className="detail-label">Message:</span>
                                            <p className="detail-message">{freelancer.message}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="action-buttons">
                                    <button className="approve-button" onClick={() => handleVerify(freelancer._id)}>Approve</button>
                                    <button className="reject-button" onClick={() => handleDelete(freelancer._id)}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="page-button"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`page-button ${currentPage === number ? 'active' : ''}`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="page-button"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListFreelancer;

