import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axios';
import './Gharbeti.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Helmet } from 'react-helmet';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const Gharbeti = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        coordinate: { lat: "", lon: "" },
        Contact_no1: "",
        Contact_no2: "",
        price: "",
        shutter: "",
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [locationSearchTerm, setLocationSearchTerm] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    // Refs for outside click detection
    const locationDropdownRef = useRef(null);
    const locationInputRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                locationDropdownRef.current &&
                !locationDropdownRef.current.contains(event.target) &&
                locationInputRef.current &&
                !locationInputRef.current.contains(event.target)
            ) {
                setShowLocationDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!locationSearchTerm || locationSearchTerm.length < 2) {
            setLocationSuggestions([]);
            setShowLocationDropdown(false);
            return;
        }

        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
                    params: {
                        text: locationSearchTerm,
                        filter: 'countrycode:np', // restrict to Nepal
                        limit: 15,
                        apiKey: GEOAPIFY_API_KEY,
                    },
                });

                const suggestions = response.data.features.map(feature => ({
                    formatted: feature.properties.formatted,
                    lat: feature.properties.lat,
                    lng: feature.properties.lon,
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

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'location') {
            setLocationSearchTerm(value);
        }
    };

    // When a suggestion is selected
    const handleLocationSelect = (location) => {
        setFormData(prev => ({
            ...prev,
            location: location.formatted,
            coordinate: { lat: location.lat, lon: location.lng },
        }));
        setLocationSearchTerm(location.formatted);
        setShowLocationDropdown(false);
    };

    // Form validation
    const validateForm = () => {
        const { name, location, Contact_no1, price, shutter } = formData;
        if (!name.trim()) return "Property name is required";
        if (!location.trim()) return "Location is required";
        if (!Contact_no1.trim()) return "Primary contact is required";
        if (Contact_no1.replace(/\D/g, '').length < 10) return "Phone number must have at least 10 digits";
        if (!price) return "Price is required";
        if (isNaN(price)) return "Price must be a number";

        return null;
    };

    // Form submit
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
                price: "",
                shutter: "",
            });
            setLocationSearchTerm("");

        } catch (err) {
            setError(err.response?.data?.message || "Submission failed. Please try again.");
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close alert handler
    const closeAlert = () => {
        setShowAlert(false);
        setError(null);
        if (success) {
            setTimeout(() => navigate('/'), 300);
        }
    };

    return (
        <div className="gharbeti-container" itemScope itemType="https://schema.org/RealEstateAgent">
            <Helmet>
                <title>List Your Property | Gharbeti</title>
                <meta name="description" content="Add your rental property to Gharbeti. Reach thousands of potential tenants looking for homes in Nepal." />
                <meta property="og:title" content="List Your Property | Gharbeti" />
                <meta property="og:description" content="List your rental property on Gharbeti and connect with potential tenants in Nepal." />
                <script type="application/ld+json">
                    {`
                    {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "List Your Property",
                        "description": "Property listing form for landlords to add rental properties",
                        "publisher": {
                            "@type": "Organization",
                            "name": "Gharbeti"
                        }
                    }
                    `}
                </script>
            </Helmet>

            {showAlert && (
                <div className="alert-overlay">
                    <div className="alert-container">
                        <div className={`alert-icon ${success ? 'success' : 'error'}`}>
                            {success ? '✓' : '!'}
                        </div>
                        <div className="alert-message">
                            {success
                                ? 'Property added successfully! Now our people will contact you and verify your property | सम्पत्ति सफलतापूर्वक थपियो! अब हाम्रा मानिसहरूले तपाईंलाई सम्पर्क गर्नेछन् र तपाईंको सम्पत्ति प्रमाणित गर्नेछन्।'
                                : error}
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

                <form onSubmit={handleSubmit} className="form" itemScope itemType="https://schema.org/AddAction">
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
                            itemProp="name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location" className="form-label">
                            Location <span className="required">*</span>
                            <span className="hint">(if not found please enter the nearest location)</span>
                        </label>
                        <div className="dropdown-container">
                            <input
                                ref={locationInputRef}
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="dropdown-input"
                                placeholder="e.g. Kathmandu"
                                autoComplete="off"
                                onFocus={() => setShowLocationDropdown(locationSearchTerm.length > 0)}
                                itemProp="address"
                            />
                            {showLocationDropdown && (
                                <div className="dropdown-list" ref={locationDropdownRef}>
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
                                itemProp="telephone"
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
                                itemProp="telephone"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price" className="form-label">
                            Monthly Rent (NPR) <span className="required">*</span>
                        </label>
                        <div className="price-input-container">
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="form-input price-input"
                                placeholder="e.g. 25000"
                                min="0"
                                step="1000"
                                required
                                itemProp="price"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="shutter" className="form-label">
                            Shutter <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="shutter"
                            name="shutter"
                            value={formData.shutter}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. 5"
                            itemProp="shutter"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                        itemProp="potentialAction"
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
