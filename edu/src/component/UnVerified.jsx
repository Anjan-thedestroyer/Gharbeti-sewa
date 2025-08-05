import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import axiosInstance from '../utils/axios';
import { FaMapMarkerAlt, FaPhone, FaMoneyBillWave, FaSpinner, FaMailBulk, FaTimes } from 'react-icons/fa';
import './Unverfied.css';
import { useNavigate } from 'react-router-dom';
import FreelancerList from '../component/FreelancerList'; // adjust path

const UnVerified = () => {
    const [landlords, setLandlords] = useState([]);
    const [hostels, setHostels] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [assigningToId, setAssigningToId] = useState(null);
    const [assignLocation, setAssignLocation] = useState(null)
    const navigate = useNavigate();
    const menuRef = useRef()
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
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setBottomSheetOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const getLandlords = async () => {
        const response = await axiosInstance.get('/landlords/');
        setLandlords(response.data.data || []);
    };

    const getHostels = async () => {
        const response = await axiosInstance.get('/hostels/get-unhostel');
        setHostels(response.data.data || []);
    };

    const handleVerify = async (id, type) => {
        if (type === 'hostel') {
            try {
                await axiosInstance.put(`/hostels/verify/${id}`);
                setHostels(hostels.filter(hostel => hostel._id !== id));
            } catch (error) {
                setError(error);
            }
        } else {
            navigate(`/verify/${id}`, { state: { type } });
        }
    };

    const handleAssignClick = (id, location) => {
        setAssignLocation(location)
        setAssigningToId(id);
        setBottomSheetOpen(true);
    };

    // const handleFreelancerSelect = async (freelancer) => {
    //     try {
    //         await axiosInstance.post(`/assign`, {
    //             freelancerId: freelancer._id,
    //             landlordId: assigningToId
    //         });
    //         setLandlords(prev => prev.filter(l => l._id !== assigningToId));
    //         setBottomSheetOpen(false);
    //         setAssigningToId(null);
    //     } catch (error) {
    //         console.error("Assignment failed:", error);
    //         setError("Could not assign freelancer");
    //     }
    // };

    const renderEntityCard = (entity, type) => {
        const entityType = type === 'landlord' ? 'RentalProperty' : 'Hostel';
        return (
            <li key={entity._id} className="entity-card" itemScope itemType={`https://schema.org/${entityType}`}>
                <div className="entity-name" itemProp="name">{entity.name || `Unnamed ${type}`}</div>
                <div className="entity-detail" itemProp="address">
                    <FaMapMarkerAlt /> {entity.location || 'Location not specified'}
                </div>
                <div className="entity-detail" itemProp="priceRange">
                    <FaMoneyBillWave /> {entity.pricing || entity.price ? `Rs ${entity.pricing || entity.price}` : 'Price not specified'}
                </div>
                <div className="entity-detail" itemProp="telephone">
                    <FaPhone /> {entity.Contact_no1 || entity.contact_no || 'Contact not provided'}
                </div>
                {entity.Contact_no2 && (
                    <div className="entity-detail" itemProp="telephone">
                        <FaPhone /> {entity.Contact_no2}
                    </div>
                )}
                {entity.email && (
                    <div className="entity-detail" itemProp="email">
                        <FaMailBulk /> {entity.email}
                    </div>
                )}
                <div className='btn-container'>
                    <button onClick={() => handleVerify(entity._id, type)} className="verify-btn">
                        Verify
                    </button>
                    {
                        type === 'landlord' && (
                            <button onClick={() => handleAssignClick(entity._id, entity.location)} className="verify-btn">
                                Assign
                            </button>
                        )
                    }
                </div>
                <meta itemProp="availability" content="https://schema.org/PreOrder" />
            </li>
        );
    };

    return (
        <>
            <Helmet>
                <title>Unverified Listings | Ghar Beti Sewa</title>
                <meta name="description" content="Review and verify unverified property and hostel listings on our platform" />
            </Helmet>

            <main className="unverified-container">
                {loading ? (
                    <div className="loading-container">
                        <FaSpinner className="spinner" />
                        <p>Loading verification queue...</p>
                    </div>
                ) : error ? (
                    <div className="error-message" role="alert">
                        <p>Error: {error}</p>
                        <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
                    </div>
                ) : (
                    <>
                        <section className="unverified-section" aria-labelledby="landlords-heading">
                            <h2 id="landlords-heading">Unverified Properties</h2>
                            {landlords.length > 0 ? (
                                <ul className="entities-list">
                                    {landlords.map(landlord => renderEntityCard(landlord, 'landlord'))}
                                </ul>
                            ) : (
                                <p>No unverified properties found.</p>
                            )}
                        </section>

                        <section className="unverified-section" aria-labelledby="hostels-heading">
                            <h2 id="hostels-heading">Unverified Hostels</h2>
                            {hostels.length > 0 ? (
                                <ul className="entities-list">
                                    {hostels.map(hostel => renderEntityCard(hostel, 'hostel'))}
                                </ul>
                            ) : (
                                <p>No unverified hostels found.</p>
                            )}
                        </section>
                    </>
                )}
            </main>

            <div ref={menuRef} className={`bottom-sheet ${bottomSheetOpen ? 'open' : ''}`}>
                <div className="sheet-header">
                    <span>Assign Freelancer</span>
                    <button onClick={() => setBottomSheetOpen(false)} className="close-btn">
                        <FaTimes />
                    </button>
                </div>
                <FreelancerList id={assigningToId} location={assignLocation} />
            </div>
        </>
    );
};

export default UnVerified;
