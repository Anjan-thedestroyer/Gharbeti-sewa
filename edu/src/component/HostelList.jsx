import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import './Gharbeti.css';
import axiosInstance from "../utils/axios";

const OPENCAGE_API_KEY = "e9dc05bc97ad4b048d796966fedc7fb0";

const HostelList = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        Rooms: "",
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

    useEffect(() => {
        if (!locationSearchTerm || locationSearchTerm.length < 2) {
            setLocationSuggestions([]);
            setShowLocationDropdown(false);
            return;
        }

        const fetchLocations = async () => {
            try {
                const { data } = await axios.get(
                    "https://api.opencagedata.com/geocode/v1/json",
                    {
                        params: {
                            key: OPENCAGE_API_KEY,
                            q: `${locationSearchTerm} Kathmandu`,
                            countrycode: "np",
                            limit: 10,
                        },
                    }
                );
                const suggestions = data.results.map((place) => ({
                    formatted: place.formatted,
                    lat: place.geometry.lat,
                    lon: place.geometry.lng,
                }));
                setLocationSuggestions(suggestions);
                setShowLocationDropdown(suggestions.length > 0);
            } catch (e) {
                console.error("Locationlocation lookup error:", e);
                setLocationSuggestions([]);
            }
        };

        const id = setTimeout(fetchLocations, 300);
        return () => clearTimeout(id);
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
                showAlertMessage("Please select at most 5 image.", false);
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
                image: prev.image.filter(
                    (_, idx) => previews[idx]?.id !== id
                ),
            }));
        },
        [previews]
    );

    const validateForm = () => {
        const { name, location, Rooms, contact_no, email, price, image } = formData;
        if (!name.trim()) return "Please enter hostel name.";
        if (!location.trim()) return "Please enter the location.";
        if (!Rooms || Number(Rooms) <= 0) return "Rooms must be a positive number.";
        if (!/^[9|98]\d{9}$/.test(contact_no))
            return "Contact number must be a valid 10-digit Nepali mobile.";
        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        )
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
            navigate('/');
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
                withCredentials: true
            });

            showAlertMessage("Hostel added successfully!", true);
            setFormData({
                name: "",
                location: "",
                Rooms: "",
                contact_no: "",
                email: "",
                price: "",
                image: [],
                coordinate: null,
            });
            setPreviews([]);
        } catch (err) {
            showAlertMessage(
                err.response?.data?.message || "Something went wrong. Please try again.",
                false
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="gharbeti-container">
            {showAlert && (
                <div className="alert-overlay">
                    <div className="alert-container">
                        <div className={`alert-icon ${isSuccess ? 'success' : 'error'}`}>
                            {isSuccess ? '✓' : '!'}
                        </div>
                        <div className="alert-message">{alertMessage}</div>
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
                <header className="form-header">
                    <button onClick={() => navigate(-1)} className="back">
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="form-title">Gharbeti</h1>
                    <p className="form-subtitle">Add a new hostel property</p>
                </header>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Hostel name */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Hostel Name <span className="required">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. Sunshine Villa"
                            required
                        />
                    </div>

                    {/* Locationlocation with autocomplete */}
                    <div className="form-group">
                        <label htmlFor="location" className="form-label">
                            Location <span className="required">*</span>
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
                                onFocus={() =>
                                    setShowLocationDropdown(locationSearchTerm.length > 0)
                                }
                            />
                            {showLocationDropdown && (
                                <div className="dropdown-list">
                                    {locationSuggestions.length ? (
                                        locationSuggestions.map((loc, i) => (
                                            <div
                                                key={i}
                                                className={`dropdown-item ${formData.location === loc.formatted ? "active" : ""
                                                    }`}
                                                onClick={() => handleLocationSelect(loc)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {loc.formatted}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-results">
                                            {locationSearchTerm ? "No matches found" : "Start typing"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rooms */}
                    <div className="form-group">
                        <label htmlFor="Rooms" className="form-label">
                            Rooms available <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="Rooms"
                            name="Rooms"
                            min="1"
                            value={formData.Rooms}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. 5"
                            required
                        />
                    </div>

                    {/* Contact */}
                    <div className="form-group">
                        <label htmlFor="contact_no" className="form-label">
                            Contact number <span className="required">*</span>
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
                        />
                    </div>

                    {/* Price */}
                    <div className="form-group">
                        <label htmlFor="price" className="form-label">
                            Monthly price (NPR) <span className="required">*</span>
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
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Property Description <span>*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Describe your property in detail and write something about the food and menu,also with schedule "
                            required
                            rows="6"
                        />
                    </div>

                    {/* Image picker */}
                    <div className="form-group">
                        <label className="form-label">
                            Property Photos <span className="required">*</span>
                        </label>

                        <label className="upload-box">
                            <input
                                type="file"
                                onChange={handleImageChange}
                                multiple
                                accept="image/*"
                                className="file-input"
                            />

                            {previews.length === 0 ? (
                                <div className="upload-content">
                                    <svg className="upload-icon" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                    <p>Click to upload photos</p>
                                    <small>JPG or PNG (max 5 MB each)</small>
                                </div>
                            ) : (
                                <div className="preview-grid">
                                    {previews.map((preview) => (
                                        <div key={preview.id} className="thumb">
                                            <img src={preview.url} alt="preview" className="preview-image" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(preview.id)}
                                                className="remove-btn"
                                                aria-label="Remove photo"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </label>

                        <div className="image-counter">
                            {previews.length > 0
                                ? `${previews.length} / 5 photos selected`
                                : 'No photos selected'}
                        </div>
                    </div>

                    {/* Submit */}
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
                        ) : 'Add Hostel'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HostelList;