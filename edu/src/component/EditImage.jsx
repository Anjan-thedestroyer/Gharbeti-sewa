import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const EditImage = () => {
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`hostels/get/${id}`);
                const existingImages = response.data.data.image || [];

                setPreviews(existingImages.map((url, index) => ({
                    id: index,
                    url
                })));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.slice(0, 5 - previews.length);

        const newPreviews = newFiles.map((file, index) => ({
            id: Date.now() + index,
            url: URL.createObjectURL(file),
            file
        }));

        setImages((prev) => [...prev, ...newFiles]);
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = async (idToRemove) => {
        const index = previews.findIndex((img) => img.id === idToRemove);

        // For newly uploaded files (not yet saved on DB)
        if (index >= images.length) {
            setPreviews(prev => prev.filter(img => img.id !== idToRemove));
            return;
        }

        try {
            const res = await axiosInstance.put(`/hostel/delete-image`, {
                id, // hostel id
                index
            });

            if (res.data.success) {
                setPreviews(prev => prev.filter((_, i) => i !== index));
                setImages(prev => prev.filter((_, i) => i !== index));
            } else {
                alert("Image deletion failed: " + res.data.message);
            }
        } catch (error) {
            console.error("Image deletion failed", error);
            alert("Image deletion error");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Add old image URLs
            previews.forEach((preview) => {
                if (!preview.file) {
                    formData.append('oldImages[]', preview.url);
                }
            });

            // Add new image files
            images.forEach((image) => {
                formData.append('image', image);
            });

            const response = await axiosInstance.put(`/hostels/edit-details/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Images updated successfully!');
            console.log(response.data);


        } catch (error) {
            console.error(error);
            alert('Failed to update images.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div>
            <div className="image-edit-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            Property Photos <span>*</span>
                        </label>

                        <label className="upload-box">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="file-input"
                                onChange={handleImageChange}
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
                                <div className="preview-grid">
                                    {previews.map((preview) => (
                                        <div key={preview.id} className="thumb">
                                            <img src={preview.url} alt="preview" height="50" />
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeImage(preview.id)}
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditImage;
