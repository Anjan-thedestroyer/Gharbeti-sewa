import React, { useState, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';

const Verify = () => {
    const [data, setData] = useState({
        length: "",
        width: "",
        room: "",
        bathroom: "",
        description: "",
        image: []
    });
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previews, setPreviews] = useState([]);
    const { id } = useParams();

    const handleImageChange = useCallback((event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        // Check total image won't exceed 5
        if (files.length + data.image.length > 5) {
            setError("Maximum 5 image allowed");
            return;
        }

        // Create previews for all selected image
        const newPreviews = files.map(file => ({
            id: URL.createObjectURL(file),
            url: URL.createObjectURL(file),
            file
        }));

        setPreviews(prev => [...prev, ...newPreviews]);
        setData(prev => ({
            ...prev,
            image: [...prev.image, ...files]
        }));
    }, [data.image.length]);

    const removeImage = useCallback((id) => {
        setPreviews(prev => {
            const updated = prev.filter(item => item.id !== id);
            const removed = prev.find(item => item.id === id);
            if (removed) URL.revokeObjectURL(removed.url);
            return updated;
        });

        setData(prev => ({
            ...prev,
            image: prev.image.filter((_, index) => {
                return prev.image[index] !==
                    previews.find(p => p.id === id)?.file;
            })
        }));
    }, [previews]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { length, width, room, bathroom, description, image } = data;
        if (!length.trim()) return "Please enter the length of the property";
        if (!width.trim()) return "Please enter the width of the property";
        if (!room.trim()) return "Please enter the number of rooms";
        if (!bathroom.trim()) return "Please enter the number of bathrooms";
        if (!description.trim()) return "Please enter the description of the property";
        if (image.length === 0) return "Please upload at least one image of the property";
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setIsSubmitting(false);
            return;
        }

        try {
            console.log(data)
            const formData = new FormData();
            formData.append('length', data.length);
            formData.append('width', data.width);
            formData.append('room', data.room);
            formData.append('bathroom', data.bathroom);
            formData.append('description', data.description);
            data.image.forEach((image) => {
                formData.append('image', image);
            });


            await axiosInstance.put(`/landlords/verify/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });


            setSuccess(true);
            setData({
                length: "",
                width: "",
                room: "",
                bathroom: "",
                description: "",
                image: []
            });

            setPreviews([]);

        } catch (error) {
            setError(error.response?.data?.message || "Verification failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    if (success) {
        setTimeout(() => navigate('/'), 3000);

    }

    return (
        <div className="gharbeti-container">
            {showAlert && (
                <div className="alert-overlay">
                    <div className="alert-container">
                        <div className={`alert-icon ${success ? 'success' : 'error'}`}>
                            {success ? '✓' : '!'}
                        </div>
                        <div className="alert-message">
                            {success ?
                                'Application verified.' :
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
                    <h1 className="form-title">Gharbeti</h1>
                    <p className="form-subtitle">Verify a new rental property</p>
                </div>



                <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="length" className="form-label">
                            Length (meters) <span>*</span>
                        </label>
                        <input
                            type="number"
                            id="length"
                            name="length"
                            value={data.length}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter length in meters"
                            required
                            min="0"
                            step="0.1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="width" className="form-label">
                            Width (meters) <span>*</span>
                        </label>
                        <input
                            type="number"
                            id="width"
                            name="width"
                            value={data.width}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter width in meters"
                            required
                            min="0"
                            step="0.1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="room" className="form-label">
                            Number of Rooms <span>*</span>
                        </label>
                        <input
                            type="number"
                            id="room"
                            name="room"
                            value={data.room}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter number of rooms"
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bathroom" className="form-label">
                            Number of Bathrooms <span>*</span>
                        </label>
                        <input
                            type="number"
                            id="bathroom"
                            name="bathroom"
                            value={data.bathroom}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter number of bathrooms"
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Property Description <span>*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Describe your property in detail"
                            required
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Property Photos <span>*</span>
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
                                    <small>JPG or PNG (max 5 MB each)</small>
                                </div>
                            ) : (
                                /* Thumbnails grid lives INSIDE the box */
                                <div className="preview-grid">
                                    {previews.map((preview) => (
                                        <div key={preview.id} className="thumb">
                                            <img src={preview.url} height={"50px"} alt="preview" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(preview.id)}
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

                        {/* Optional image counter just below the box */}
                        <div className="image-counter">
                            {previews.length > 0
                                ? `${previews.length} / 5 photos selected`
                                : 'No photos selected'}
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
                                Verifying...
                            </>
                        ) : 'Verify Property'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Verify;