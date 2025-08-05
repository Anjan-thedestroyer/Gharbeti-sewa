import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios'; // Using your axiosInstance
import { Helmet } from 'react-helmet';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import './VerifyEmail.css';

const VerifyEmail = () => {
    const [status, setStatus] = useState({
        loading: true,
        success: false,
        message: '',
        icon: null
    });
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');

            if (!code) {
                setStatus({
                    loading: false,
                    success: false,
                    message: 'Invalid verification link. Please check your email for the correct link.',
                    icon: <FaTimesCircle className="error-icon" />
                });
                return;
            }

            try {
                const response = await axiosInstance.post('/user/verify-email', { code });

                if (response.data.success) {
                    setStatus({
                        loading: false,
                        success: true,
                        message: 'Email successfully verified! Redirecting to login...',
                        icon: <FaCheckCircle className="success-icon" />
                    });

                    // Redirect after delay
                    const timer = setTimeout(() => {
                        navigate('/login', {
                            state: {
                                fromVerification: true,
                                emailVerified: true
                            }
                        });
                    }, 3000);

                    return () => clearTimeout(timer);
                } else {
                    setStatus({
                        loading: false,
                        success: false,
                        message: response.data.message || 'Verification failed. The link may have expired or already been used.',
                        icon: <FaTimesCircle className="error-icon" />
                    });
                }
            } catch (error) {
                let errorMessage = 'Something went wrong during verification.';

                if (error.response) {
                    errorMessage = error.response.data.message ||
                        `Verification failed (${error.response.status}). Please try again.`;
                } else if (error.request) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                }

                setStatus({
                    loading: false,
                    success: false,
                    message: errorMessage,
                    icon: <FaTimesCircle className="error-icon" />
                });
            }
        };

        verifyEmail();
    }, [location, navigate]);

    return (
        <div className="verify-email-container">
            <Helmet>
                <title>Email Verification | Gharbeti-sewa</title>
                <meta name="description" content="Verify your email address to complete your account registration." />
            </Helmet>

            <div className="verification-card">
                {status.loading ? (
                    <div className="loading-state">
                        <FaSpinner className="spinner-icon" />
                        <h2>Verifying your email...</h2>
                        <p>Please wait while we confirm your email address.</p>
                    </div>
                ) : (
                    <div className={`result-state ${status.success ? 'success' : 'error'}`}>
                        <div className="status-icon">{status.icon}</div>
                        <h2>{status.success ? 'Verification Successful!' : 'Verification Failed'}</h2>
                        <p className="status-message">{status.message}</p>



                        {status.success && (
                            <div className="redirect-message">
                                <p>You will be automatically redirected shortly...</p>
                                <button
                                    className="manual-redirect"
                                    onClick={() => navigate('/login')}
                                >
                                    Go to Login Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;