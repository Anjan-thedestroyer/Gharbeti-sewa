import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import './VerifyEmail.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                const res = await axiosInstance.get(`/user/verify-email/${code}`);
                if (res.data.success) {
                    setStatus('success');
                    // Start countdown
                    const timer = setInterval(() => {
                        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
                    }, 1000);
                    return () => clearInterval(timer);
                } else {
                    setStatus('error');
                }
            } catch (err) {
                console.log(err);
                setStatus('error');
            }
        };

        verify();
    }, [searchParams, navigate]);

    useEffect(() => {
        if (status === 'success' && countdown === 0) {
            navigate('/login');
        }
    }, [countdown, status, navigate]);

    return (
        <>
            <Helmet>
                <title>Email Verification | Your Site Name</title>
                <meta name="description" content="Verify your email address to complete your account registration." />
                <meta property="og:title" content="Email Verification | Your Site Name" />
                <meta property="og:description" content="Complete your account setup by verifying your email address." />
                <link rel="canonical" href={`${window.location.origin}/verify-email`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EmailMessage",
                        "description": "Email verification process",
                        "potentialAction": {
                            "@type": "ConfirmAction",
                            "name": "VerifyEmail",
                            "handler": {
                                "@type": "HttpActionHandler",
                                "url": window.location.href
                            }
                        }
                    })}
                </script>
            </Helmet>

            <div className="verification-container">
                {status === 'verifying' && (
                    <div className="verification-status verifying">
                        <FaSpinner className="spinner-icon" />
                        <h2>Verifying Your Email</h2>
                        <p>Please wait while we verify your email address...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="verification-status success">
                        <FaCheckCircle className="status-icon" />
                        <h2>Email Verified Successfully!</h2>
                        <p>Your email address has been confirmed.</p>
                        <p className="countdown-message">
                            Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
                        </p>
                        <button
                            className="redirect-button"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login Now
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="verification-status error">
                        <FaTimesCircle className="status-icon" />
                        <h2>Verification Failed</h2>
                        <p>The verification link is invalid or has expired.</p>
                        <div className="action-buttons">
                            <button
                                className="resend-button"
                                onClick={() => navigate('/resend-verification')}
                            >
                                Resend Verification Email
                            </button>
                            <button
                                className="home-button"
                                onClick={() => navigate('/')}
                            >
                                Return to Homepage
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default VerifyEmail;