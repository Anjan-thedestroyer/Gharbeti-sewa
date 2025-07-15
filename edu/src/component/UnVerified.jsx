import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { FaMapMarkerAlt, FaPhone, FaMoneyBillWave, FaSpinner } from 'react-icons/fa';
import './Unverfied.css';
import { useNavigate } from 'react-router-dom';

const UnVerified = () => {
    const [landlords, setLandlords] = useState([]);
    const [hostels, setHostels] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([getLandlords(), getHostels()]);
                setSuccess(true);
            } catch (error) {
                console.error(error);
                setError(error.message || 'Failed to fetch data');
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getLandlords = async () => {
        const response = await axiosInstance.get('/landlords/');
        setLandlords(response.data.data || []);
    };

    const getHostels = async () => {
        const response = await axiosInstance.get('/hostels/get-unhostel');
        setHostels(response.data.data || []);
    };

    const handleVerify = (id, type) => {
        navigate(`/verify/${id}`, { state: { type } });
    };

    const renderEntityCard = (entity, type) => {
        return (
            <li key={entity._id} className="entity-card">
                <div className="entity-name">{entity.name || `Unnamed ${type}`}</div>
                <div className="entity-detail">
                    <FaMapMarkerAlt /> {entity.location || 'Location not specified'}
                </div>
                <div className="entity-detail">
                    <FaMoneyBillWave /> {entity.pricing ? `Rs ${entity.pricing}` : 'Price not specified'}
                </div>
                <div className="entity-detail">
                    <FaPhone /> {entity.Contact_no1 || 'Contact not provided'}
                </div>
                {entity.Contact_no2 && (
                    <div className="entity-detail">
                        <FaPhone /> {entity.Contact_no2}
                    </div>
                )}
                <div className='btn-container'>
                    <button
                        onClick={() => handleVerify(entity._id, type)}
                        className="verify-btn"
                    >
                        Verify
                    </button>
                </div>
            </li>
        );
    };

    return (
        <div className="unverified-container">
            {loading ? (
                <div className="loading-container">
                    <FaSpinner className="spinner" />
                    <p>Loading...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    Error: {error}
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <section className="unverified-section">
                        <h2 className="section-header">Unverified Landlords</h2>
                        {landlords.length > 0 ? (
                            <ul className="entities-list">
                                {landlords.map(landlord => renderEntityCard(landlord, 'landlord'))}
                            </ul>
                        ) : (
                            <p className="no-entities">No unverified landlords found.</p>
                        )}
                    </section>

                    <section className="unverified-section">
                        <h2 className="section-header">Unverified Hostels</h2>
                        {hostels.length > 0 ? (
                            <ul className="entities-list">
                                {hostels.map(hostel => renderEntityCard(hostel, 'hostel'))}
                            </ul>
                        ) : (
                            <p className="no-entities">No unverified hostels found.</p>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default UnVerified;