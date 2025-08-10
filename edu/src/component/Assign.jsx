import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import './Assign.css'

const Assign = ({ freelancerIds, RoomId, onClose }) => {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(`/freelance/assign/${RoomId}`, {
                freelancerIds,
                description
            });
            setSuccess(true);
            setDescription("");
            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);
        } catch (error) {
            console.error('Assignment failed:', error);
            setError(error.response?.data?.message || 'Failed to assign task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="assign-form">
            <h2 className="assign-form__title">Assign Task</h2>

            {success ? (
                <div className="assign-form__success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p>Task assigned successfully!</p>
                </div>
            ) : (
                <>
                    <div className="assign-form__group">
                        <label htmlFor="description" className="assign-form__label">Task Description*</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="assign-form__textarea"
                            required
                            rows="6"
                            placeholder="Describe the task in detail..."
                        />
                    </div>

                    {error && (
                        <div className="assign-form__error">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="assign-form__actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="assign-form__button assign-form__button--cancel"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="assign-form__button assign-form__button--submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="assign-form__spinner" viewBox="0 0 50 50">
                                        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                    </svg>
                                    Assigning...
                                </>
                            ) : (
                                'Assign Task'
                            )}
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default Assign;