// src/pages/ClientApply.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Gharbeti.css';
import axiosInstance from "../utils/axios";
import { FiArrowLeft } from "react-icons/fi";

const ClientApply = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        No_of_people: "",
        No_of_rooms: "",
        email: "",
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("myData"));
        if (stored?.data) {
            setRole(stored.data);
            console.log(role);

            if (role === stored.data) {
                localStorage.removeItem('myData');
            }
        }
    }, [role]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const { name, phone, No_of_people, No_of_rooms, email } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name.trim()) return "Please enter your full name";
        if (!email.trim()) return "Please enter your email address";
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        if (!phone.trim()) return "Phone number is required";

        const phoneDigits = phone.replace(/\D/g, "");
        if (phoneDigits.length < 10) return "Phone number must have at least 10 digits";

        if (!No_of_people.trim()) return "Number of people is required";
        if (parseInt(No_of_people) < 1) return "Number of people must be at least 1";

        if (!No_of_rooms.trim()) return "Number of rooms is required";
        if (parseInt(No_of_rooms) < 1) return "Number of rooms must be at least 1";

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
            const endpoint = role === 'Landlord'
                ? `/buyers/add-buyer/${id}`
                : `/buyers/add-buyer/hostel/${id}`;

            await axiosInstance.post(endpoint, formData);

            setSuccess(true);
            setShowAlert(true);
            setFormData({
                name: "",
                phone: "",
                No_of_people: "",
                No_of_rooms: "",
                email: "",
            });

        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeAlert = () => {
        setShowAlert(false);
        setError(null);
        if (success) {
            navigate(-1); // Go back after successful submission
        }
    };

    return (
        <div className="gharbeti-container">
            {/* Exact same alert system as in Gharbeti.jsx */}
            {showAlert && (
                <div className="alert-overlay">
                    <div className="alert-container">
                        <div className={`alert-icon ${success ? 'success' : 'error'}`}>
                            {success ? '✓' : '!'}
                        </div>
                        <div className="alert-message">
                            {success ?
                                'Application submitted successfully! Our team will contact you shortly. | आवेदन सफलतापूर्वक पेश गरियो! हाम्रो टोलीले चाँडै नै तपाईंलाई सम्पर्क गर्नेछ।' :
                                error}
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
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="back-button"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="form-title">Apply</h1>
                    <p className="form-subtitle">Apply for this property</p>
                </div>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Full Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. Ram Sharma"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. ram@gmail.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                            Phone Number <span className="required">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. 98########"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="No_of_people" className="form-label">
                            Number of People <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="No_of_people"
                            name="No_of_people"
                            min="1"
                            value={formData.No_of_people}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. 2"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="No_of_rooms" className="form-label">
                            Number of Rooms <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="No_of_rooms"
                            name="No_of_rooms"
                            min="1"
                            value={formData.No_of_rooms}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g. 1"
                            required
                        />
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
                        ) : 'Apply Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClientApply;