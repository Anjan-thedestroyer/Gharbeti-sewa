import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const [status, setStatus] = useState({ loading: true, success: false, message: '' });
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
                    message: 'Invalid verification link.',
                });
                return;
            }

            try {
                const response = await axios.post('http://localhost:8080/api/user/verify-email', { code });
                console.log(response.data)

                if (response.data.success) {
                    setStatus({
                        loading: false,
                        success: true,
                        message: 'Email successfully verified! Redirecting...',
                    });

                    // Redirect the user to the login page after a short delay
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } if (response.data.error){
                    setStatus({
                        loading: false,
                        success: false,
                        message: response.data.message || 'Verification failed.',
                    });
                }
            } catch (error) {
                setStatus({
                    loading: false,
                    success: false,
                    message: error.response?.data?.message || 'Something went wrong.',
                    
                    
                });
            }
        };

        verifyEmail();
    }, [location, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {status.loading ? (
                <p>Verifying your email...</p>
            ) : (
                <>
                    <h1>{status.success ? 'SUCESSFULL': '❌ ERROR'}</h1>
                    <p>{status.message}</p>
                </>
            )}
        </div>
    );
};

export default VerifyEmail;
