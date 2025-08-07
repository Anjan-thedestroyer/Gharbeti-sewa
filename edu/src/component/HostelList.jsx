import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Helmet } from "react-helmet";
import './Gharbeti.css';
import axiosInstance from "../utils/axios";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const HostelList = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        room: "",
        description: "",
        contact_no: "",
        email: "",
        price: "",
        image: [],
        coordinate: null,
    });

    const [previews, setPreviews] = useState([]);
    const [locationSearchTerm, setLocationSearchTerm] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // Refs for outside click handling
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

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Geoapify location autocomplete effect with debounce
    useEffect(() => {
        if (!locationSearchTerm || locationSearchTerm.length < 2) {
            setLocationSuggestions([]);
            setShowLocationDropdown(false);
            return;
        }

        const fetchLocations = async () => {
            try {
                const response = await axios.get(
                    "https://api.geoapify.com/v1/geocode/autocomplete",
                    {
                        params: {
                            text: locationSearchTerm,
                            filter: "countrycode:np",
                            limit: 10,
                            apiKey: GEOAPIFY_API_KEY,
                        },
                    }
                );

                const suggestions = response.data.features.map((feature) => ({
                    formatted: feature.properties.formatted,
                    lat: feature.properties.lat,
                    lon: feature.properties.lon,
                }));

                setLocationSuggestions(suggestions);
                setShowLocationDropdown(suggestions.length > 0);
            } catch (error) {
                console.error("Location lookup error:", error);
                setLocationSuggestions([]);
                setShowLocationDropdown(false);
            }
        };

        const debounceTimer = setTimeout(fetchLocations, 300);
        return () => clearTimeout(debounceTimer);
    }, [locationSearchTerm]);

    const handleLocationSelect = (loc) => {
        setFormData((prev) => ({
            ...prev,
            location: loc.formatted,
            coordinate: { lat: loc.lat, lon: loc.lon },
        }));
        setLocationSearchTerm(loc.formatted);
        setShowLocationDropdown(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "location") setLocationSearchTerm(value);
    };

    const handleImageChange = useCallback(
        (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            if (files.length + formData.image.length > 5) {
                showAlertMessage("Please select at most 5 images.", false);
                return;
            }

            const newPreviewObjs = files.map((file) => ({
                id: URL.createObjectURL(file),
                url: URL.createObjectURL(file),
                file,
            }));

            setPreviews((prev) => [...prev, ...newPreviewObjs]);
            setFormData((prev) => ({ ...prev, image: [...prev.image, ...files] }));
        },
        [formData.image.length]
    );

    const handleRemoveImage = useCallback(
        (id) => {
            setPreviews((prev) => {
                const updated = prev.filter((p) => p.id !== id);
                const removed = prev.find((p) => p.id === id);
                if (removed) URL.revokeObjectURL(removed.url);
                return updated;
            });
            setFormData((prev) => ({
                ...prev,
                image: prev.image.filter((_, idx) => previews[idx]?.id !== id),
            }));
        },
        [previews]
    );

    const validateForm = () => {
        const { name, location, room, contact_no, email, price, image } = formData;
        if (!name.trim()) return "Please enter hostel name.";
        if (!location.trim()) return "Please enter the location.";
        if (!room || Number(room) <= 0) return "room must be a positive number.";
        if (!/^[9|98]\d{9}$/.test(contact_no))
            return "Contact number must be a valid 10-digit Nepali mobile.";
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
            return "Please enter a valid e-mail.";
        if (!price || Number(price) <= 0) return "Price must be positive.";
        if (!image.length) return "Upload at least one image.";
        return null;
    };

    const showAlertMessage = (message, success) => {
        setAlertMessage(message);
        setIsSuccess(success);
        setShowAlert(true);
    };

    const closeAlert = () => {
        setShowAlert(false);
        if (isSuccess) {
            navigate("/");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            showAlertMessage(validationError, false);
            return;
        }

        try {
            setIsSubmitting(true);
            const fd = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (key === "image") {
                    val.forEach((file) => fd.append("image", file));
                } else if (key === "coordinate" && val) {
                    fd.append("lat", val.lat);
                    fd.append("lon", val.lon);
                } else {
                    fd.append(key, val);
                }
            });

            await axiosInstance.post("/hostels/add-hostel", fd, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            showAlertMessage(
                "Hostel added successfully! Now our team will contact you for verification. | होस्टल सफलतापूर्वक थपियो! हाम्रो टोलीले तपाईंलाई प्रमाणीकरणको लागि सम्पर्क गर्नेछ।",
                true
            );
            setFormData({
                name: "",
                location: "",
                room: "",
                description: "",
                contact_no: "",
                email: "",
                price: "",
                image: [],
                coordinate: null,
            });
            setPreviews([]);
            setLocationSearchTerm("");
        } catch (err) {

            if (err.response?.data?.message === "Refresh token missing") {
                showAlertMessage("Please login", false);
                navigate('/login');
            } else {
                showAlertMessage(
                    err.response?.data?.message || "Something went wrong. Please try again.",
                    false
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="gharbeti-container" itemScope itemType="https://schema.org/AddAction">
            <Helmet>
                <title>List Your Hostel | Gharbeti</title>
                <meta
                    name="description"
                    content="Add your hostel property to Gharbeti. Reach thousands of students looking for accommodation in Nepal."
                />
                <meta property="og:title" content="List Your Hostel | Gharbeti" />
                <meta
                    property="og:description"
                    content="List your hostel on Gharbeti and connect with potential tenants in Nepal."
                />
                <script type="application/ld+json">
                    {`
                    {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "List Hostel",
                        "description": "Property listing form for hostel owners",
                        "publisher": {
                            "@type": "Organization",
                            "name": "Gharbeti"
                        }
                    }
                    `}
                </script>
            </Helmet>

            {showAlert && (
                <div className="alert-overlay" role="alert" aria-live="assertive">
                    <div className="alert-container">
                        <div className={`alert-icon ${isSuccess ? "success" : "error"}`} aria-hidden="true">
                            {isSuccess ? "✓" : "!"}
                        </div>
                        <div className="alert-message">
                            {isSuccess
                                ? "Hostel added successfully! Now our team will contact you for verification. | होस्टल सफलतापूर्वक थपियो! हाम्रो टोलीले तपाईंलाई प्रमाणीकरणको लागि सम्पर्क गर्नेछ।"
                                : alertMessage}
                        </div>
                        <button className="alert-button" onClick={closeAlert} aria-label="Close alert">
                            OK
                        </button>
                    </div>
                </div>
            )}

            <div className="form-wrapper">
                <header className="form-header">
                    <button onClick={() => navigate(-1)} className="back" aria-label="Go back" ref={locationInputRef}>
                        <FiArrowLeft size={20} aria-hidden="true" />
                    </button>
                    <h1 className="form-title" itemProp="name">
                        List Your Hostel
                    </h1>
                    <p className="form-subtitle">Fill in the details to add your hostel property</p>
                </header>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Hostel name */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Hostel Name <span className="required" aria-hidden="true">*</span>
                            <span className="sr-only">required</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. Sunshine Villa"
                            required
                            itemProp="object.name"
                            aria-required="true"
                        />
                    </div>

                    {/* Location with autocomplete */}
                    <div className="form-group">
                        <label htmlFor="location" className="form-label">
                            Location <span className="required" aria-hidden="true">*</span>
                            <span className="sr-only">required</span>
                            <span className="hint">(nearest if exact isn't found)</span>
                        </label>
                        <div className="dropdown-container">
                            <input
                                id="location"
                                name="location"
                                value={locationSearchTerm}
                                onChange={handleInputChange}
                                className="dropdown-input"
                                placeholder="e.g. Dillibazar, Kathmandu"
                                autoComplete="off"
                                aria-autocomplete="list"
                                aria-controls="location-suggestions"
                                aria-expanded={showLocationDropdown}
                                onFocus={() => setShowLocationDropdown(locationSearchTerm.length > 0)}
                                required
                                aria-required="true"
                                itemProp="location.name"
                                ref={locationInputRef}
                            />
                            {showLocationDropdown && (
                                <ul
                                    id="location-suggestions"
                                    className="dropdown-list"
                                    role="listbox"
                                    ref={locationDropdownRef}
                                >
                                    {locationSuggestions.length ? (
                                        locationSuggestions.map((loc, i) => (
                                            <li
                                                key={i}
                                                className={`dropdown-item ${formData.location === loc.formatted ? "active" : ""
                                                    }`}
                                                onClick={() => handleLocationSelect(loc)}
                                                onMouseDown={(e) => e.preventDefault()}
                                                role="option"
                                                aria-selected={formData.location === loc.formatted}
                                            >
                                                {loc.formatted}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="no-results" role="option">
                                            {locationSearchTerm ? "No matches found" : "Start typing"}
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* room */}
                    <div className="form-group">
                        <label htmlFor="room" className="form-label">
                            room available <span className="required" aria-hidden="true">*</span>
                            <span className="sr-only">required</span>
                        </label>
                        <input
                            type="number"
                            id="room"
                            name="room"
                            min="1"
                            value={formData.room}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. 5"
                            required
                            aria-required="true"
                            itemProp="numberOfroom"
                        />
                    </div>

                    {/* Contact */}
                    <div className="form-group">
                        <label htmlFor="contact_no" className="form-label">
                            Contact number <span className="required" aria-hidden="true">*</span>
                            <span className="sr-only">required</span>
                        </label>
                        <input
                            type="tel"
                            id="contact_no"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="98########"
                            required
                            aria-required="true"
                            itemProp="telephone"
                        />
                    </div>

                    {/* Email (optional) */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            E-mail (optional)
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="info@example.com"
                            itemProp="email"
                        />
                    </div>

                    {/* Price */}
                    <div className="form-group">
                        <label htmlFor="price" className="form-label">
                            Monthly price (NPR) <span className="required" aria-hidden="true">*</span>
                            <span className="sr-only">required</span>
                        </label>
                        <div className="price-input-container">
                            <input
                                type="number"
                                id="price"
                                name="price"
                                min="0"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="form-input price-input"
                                placeholder="e.g. 15000"
                                required
                                aria-required="true"
                                itemProp="priceSpecification.price"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Property Description <span aria-hidden="true">*</span>
                            <span className="sr-only">required</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Describe your property in detail and write something about the food and menu, also with schedule"
                            required
                            rows="6"
                            aria-required="true"
                            itemProp="description"
                        />
                    </div>

                    {/* Image picker */}
                    <div className="form-group">
                        <label htmlFor="property-photos" className="form-label">
                            Property Photos <span className="required" aria-hidden="true">*</span>
                            <span className="sr-only">required</span>
                        </label>

                        <label
                            htmlFor="property-photos"
                            className="upload-box"
                            aria-describedby="photo-requirements"
                        >
                            <input
                                id="property-photos"
                                type="file"
                                onChange={handleImageChange}
                                multiple
                                accept="image/*"
                                className="file-input"
                                aria-required="true"
                            />

                            {previews.length === 0 ? (
                                <div className="upload-content">
                                    <svg className="upload-icon" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                    <p>Click to upload photos</p>
                                    <small id="photo-requirements">JPG or PNG (max 5 MB each)</small>
                                </div>
                            ) : (
                                <ul className="preview-grid">
                                    {previews.map((preview) => (
                                        <li key={preview.id} className="thumb">
                                            <img
                                                src={preview.url}
                                                alt="Property preview"
                                                className="preview-image"
                                                itemProp="image"
                                                loading="lazy"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(preview.id)}
                                                className="remove-btn"
                                                aria-label="Remove photo"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </label>

                        <div className="image-counter" aria-live="polite">
                            {previews.length > 0
                                ? `${previews.length} / 5 photos selected`
                                : "No photos selected"}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`submit-btn ${isSubmitting ? "submitting" : ""}`}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner" aria-hidden="true"></span>
                                <span aria-live="polite">Submitting...</span>
                            </>
                        ) : (
                            "Add Hostel"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HostelList;
