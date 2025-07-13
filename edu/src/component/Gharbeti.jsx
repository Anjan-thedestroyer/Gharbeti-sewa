
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axios';
import './Gharbeti.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Gharbeti = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        coordinate: { lat: "", lon: "" },
        Contact_no1: "",
        Contact_no2: "",
        pricing: "",
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [locationSearchTerm, setLocationSearchTerm] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    const OPENCAGE_API_KEY = 'e9dc05bc97ad4b048d796966fedc7fb0';

    useEffect(() => {
        if (!locationSearchTerm || locationSearchTerm.length < 2) {
            setLocationSuggestions([]);
            setShowLocationDropdown(false);
            return;
        }

        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                    params: {
                        key: OPENCAGE_API_KEY,
                        q: `${locationSearchTerm} Kathmandu`,
                        countrycode: 'np',
                        limit: 10,
                    },
                });

                const suggestions = response.data.results.map(place => ({
                    formatted: place.formatted,
                    lat: place.geometry.lat,
                    lng: place.geometry.lng,
                }));

                setLocationSuggestions(suggestions);
                setShowLocationDropdown(suggestions.length > 0);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
                setLocationSuggestions([]);
                setShowLocationDropdown(false);
            }
        };

        const debounceTimer = setTimeout(fetchLocations, 300);
        return () => clearTimeout(debounceTimer);
    }, [locationSearchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'location') {
            setLocationSearchTerm(value);
        }
    };

    const handleLocationSelect = (location) => {
        setFormData(prev => ({
            ...prev,
            location: location.formatted,
            coordinate: { lat: location.lat, lon: location.lng },
        }));
        setLocationSearchTerm(location.formatted);
        setShowLocationDropdown(false);
    };

    const validateForm = () => {
        const { name, location, Contact_no1, pricing } = formData;
        if (!name.trim()) return "Property name is required";
        if (!location.trim()) return "Location is required";
        if (!Contact_no1.trim()) return "Primary contact is required";
        if (Contact_no1.replace(/\D/g, '').length < 10) return "Phone number must have at least 10 digits";
        if (!pricing) return "Pricing is required";
        if (isNaN(pricing)) return "Pricing must be a number";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setShowAlert(true);
            setIsSubmitting(false);
            return;
        }

        try {
            await axiosInstance.post('/landlords/add', {
                ...formData,
                coordinate: {
                    lat: parseFloat(formData.coordinate.lat),
                    lon: parseFloat(formData.coordinate.lon)
                }
            });
            setSuccess(true);
            setShowAlert(true);
            setFormData({
                name: "",
                location: "",
                coordinate: { lat: "", lon: "" },
                Contact_no1: "",
                Contact_no2: "",
                pricing: ""
            });
            setLocationSearchTerm("");

        } catch (err) {
            setError(err.response?.data?.message || "Submission failed. Please try again.");
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeAlert = () => {
        setShowAlert(false);
        setError(null);
        if (success) {
            setTimeout(() => navigate('/'), 300);
        }
    };

    return (
        <div className="gharbeti-container">
            {/* Alert Modal */}
            {showAlert && (
                <div className="alert-overlay">
                    <div className="alert-container">
                        <div className={`alert-icon ${success ? 'success' : 'error'}`}>
                            {success ? '✓' : '!'}
                        </div>
                        <div className="alert-message">
                            {success ? 'Property added successfully!Now our people will contact you and verify your property | सम्पत्ति सफलतापूर्वक थपियो! अब हाम्रा मानिसहरूले तपाईंलाई सम्पर्क गर्नेछन् र तपाईंको सम्पत्ति प्रमाणित गर्नेछन्।' : error}
                        </div>
                        <button
                            className="alert-button"
                            onClick={closeAlert}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <div className="form-wrapper">
                <div className="form-header">
                    <button onClick={() => navigate(-1)} className='back-button'>
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="form-title">Gharbeti</h1>
                    <p className="form-subtitle">Add a new rental property</p>
                </div>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Property Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. Sunshine Villa"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location" className="form-label">
                            Location <span className="required">*</span>
                            <span className="hint">(if not found please enter the nearest location)</span>
                        </label>
                        <div className="dropdown-container">
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="dropdown-input"
                                placeholder="e.g. Kathmandu"
                                autoComplete="off"
                                onFocus={() => setShowLocationDropdown(locationSearchTerm.length > 0)}
                            />
                            {showLocationDropdown && (
                                <div className="dropdown-list">
                                    {locationSuggestions.length > 0 ? (
                                        locationSuggestions.map((loc, i) => (
                                            <div
                                                key={i}
                                                className={`dropdown-item ${formData.location === loc.formatted ? "active" : ""}`}
                                                onClick={() => handleLocationSelect(loc)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {loc.formatted}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="dropdown-no-results">
                                            {locationSearchTerm ? "No matches found" : "Start typing to search"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="Contact_no1" className="form-label">
                                Primary Contact <span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                id="Contact_no1"
                                name="Contact_no1"
                                value={formData.Contact_no1}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="98XXXXXXXX"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Contact_no2" className="form-label">
                                Secondary Contact
                            </label>
                            <input
                                type="tel"
                                id="Contact_no2"
                                name="Contact_no2"
                                value={formData.Contact_no2}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="98XXXXXXXX (optional)"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pricing" className="form-label">
                            Monthly Rent (NPR) <span className="required">*</span>
                        </label>
                        <div className="price-input-container">
                            <span className="currency">NPR</span>
                            <input
                                type="number"
                                id="pricing"
                                name="pricing"
                                value={formData.pricing}
                                onChange={handleInputChange}
                                className="form-input price-input"
                                placeholder="e.g. 25000"
                                min="0"
                                step="1000"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Submitting...
                            </>
                        ) : 'Add Property'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Gharbeti;