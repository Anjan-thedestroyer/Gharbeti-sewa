import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { FaTrash, FaUpload, FaSpinner } from 'react-icons/fa';
import './EditImage.css'; // Create this CSS file for styling

const EditImage = () => {
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const MAX_IMAGES = 5;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const fetchHostelImages = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/hostels/get/${id}`);
            const existingImages = response.data.data?.image || [];

            setPreviews(existingImages.map((url, index) => ({
                id: `existing-${index}`,
                url,
                isExisting: true
            })));
        } catch (error) {
            console.error("Failed to fetch hostel images:", error);
            setError("Failed to load images. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchHostelImages();
    }, [fetchHostelImages]);

    const handleImageChange = (e) => {
        setError(null);
        const files = Array.from(e.target.files);

        // Validate files
        const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        if (invalidFiles.length > 0) {
            setError(`Some files exceed the 5MB limit and weren't uploaded.`);
        }

        const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);
        const availableSlots = MAX_IMAGES - previews.length;
        const filesToAdd = validFiles.slice(0, availableSlots);

        if (filesToAdd.length === 0 && validFiles.length > 0) {
            setError(`You can only upload up to ${MAX_IMAGES} images.`);
            return;
        }

        const newPreviews = filesToAdd.map((file) => ({
            id: `new-${Date.now()}-${file.name}`,
            url: URL.createObjectURL(file),
            file,
            isExisting: false
        }));

        setImages(prev => [...prev, ...filesToAdd]);
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = async (idToRemove) => {
        setError(null);
        const imageToRemove = previews.find(img => img.id === idToRemove);

        try {
            // If it's an existing image, delete from server
            if (imageToRemove.isExisting) {
                const index = previews.findIndex(img => img.id === idToRemove);
                await axiosInstance.put(`/hostels/delete-image`, {
                    id,
                    index
                });
            }

            // Update local state
            setPreviews(prev => prev.filter(img => img.id !== idToRemove));
            setImages(prev => prev.filter((_, i) => i !== previews.findIndex(img => img.id === idToRemove)));

        } catch (error) {
            console.error("Failed to delete image:", error);
            setError("Failed to delete image. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('id', id);

            // Separate existing and new images
            const existingImages = previews.filter(img => img.isExisting).map(img => img.url);
            const newImages = previews.filter(img => !img.isExisting).map(img => img.file);

            // Add existing image URLs
            existingImages.forEach(url => {
                formData.append('existingImages', url);
            });

            // Add new image files
            newImages.forEach(file => {
                formData.append('image', file);
            });

            const response = await axiosInstance.put(`/hostels/edit-details/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                navigate(-1);
            } else {
                throw new Error(response.data.message || 'Failed to update images');
            }
        } catch (error) {
            console.error("Image update error:", error);
            setError(error.message || 'Failed to update images. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FaSpinner className="spinner" />
                <p>Loading images...</p>
            </div>
        );
    }

    return (
        <div className="edit-image-container">
            <h2 className="edit-image-title">Edit Property Photos</h2>

            {error && (
                <div className="error-alert">
                    {error}
                    <button onClick={() => setError(null)} className="close-error">
                        &times;
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="image-edit-form">
                <div className="form-group">
                    <label className="form-label">
                        Property Photos <span className="required">*</span>
                        <span className="image-count">
                            ({previews.length}/{MAX_IMAGES})
                        </span>
                    </label>

                    <div className="image-upload-container">
                        <label className={`upload-box ${previews.length >= MAX_IMAGES ? 'disabled' : ''}`}>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="file-input"
                                onChange={handleImageChange}
                                disabled={previews.length >= MAX_IMAGES || isSubmitting}
                            />
                            <div className="upload-content">
                                <FaUpload className="upload-icon" />
                                <p>Click to upload photos</p>
                                <small>JPG or PNG (max 5MB each)</small>
                            </div>
                        </label>

                        {previews.length > 0 && (
                            <div className="preview-grid">
                                {previews.map((preview) => (
                                    <div key={preview.id} className="image-thumbnail">
                                        <img
                                            src={preview.url}
                                            height='100px'
                                            alt="Preview"
                                            className="thumbnail-image"
                                            onLoad={() => {
                                                // Revoke object URL to avoid memory leaks
                                                if (!preview.isExisting) {
                                                    URL.revokeObjectURL(preview.url);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeImage(preview.id)}
                                            disabled={isSubmitting}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate(`/hostel/${id}`)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting || previews.length === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="submit-spinner" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditImage;