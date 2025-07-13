import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { FaMapMarkerAlt, FaPhone, FaMoneyBillWave } from 'react-icons/fa';
import './Unverfied.css'; // Make sure to create this CSS file
import { useNavigate } from 'react-router-dom';

const UnVerified = () => {
    const [data, setData] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/landlords/');
            console.log(response.data);
            setData(response.data.data || []);
            setSuccess(true);
            setError(null);
        } catch (error) {
            console.error(error);
            setError(error.message || 'Failed to fetch data');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };
    const handleVerify = (id) => {
        navigate(`/verify/${id}`)
    }

    return (
        <div className="unverified-container">
            {loading && <p className="loading-text">Loading...</p>}

            {error && (
                <div className="error-message">
                    Error: {error}
                </div>
            )}

            {success && data.length > 0 ? (
                <div>
                    <h2 className="unverified-header">Unverified Landlords</h2>
                    <ul className="landlords-list">
                        {data.map((landlord) => (
                            <li key={landlord.id} className="landlord-card">
                                <div className="landlord-name">{landlord.name || 'Unnamed Landlord'}</div>
                                <div className="landlord-detail">
                                    <FaMapMarkerAlt /> {landlord.location || 'Location not specified'}
                                </div>
                                <div className="landlord-detail">
                                    <FaMoneyBillWave /> {landlord.pricing ? `Rs${landlord.pricing}` : 'Price not specified'}
                                </div>
                                <div className="landlord-detail">
                                    <FaPhone /> {landlord.Contact_no1 || 'Contact not provided'}
                                </div>

                                {landlord.Contact_no2 && (
                                    <div className="landlord-detail">
                                        <FaPhone /> {landlord.Contact_no2}
                                    </div>


                                )}
                                <div className='btn'>
                                    <button onClick={() => handleVerify(landlord._id)}>Verify</button>
                                </div>
                            </li>

                        ))}
                    </ul>
                </div>
            ) : (
                !loading && <p className="no-landlords">No unverified landlords found.</p>
            )}
        </div>
    );
};

export default UnVerified;