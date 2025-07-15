import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'

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
                    setTimeout(() => navigate('/login'), 3000);
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

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            {status === 'verifying' && <p>Verifying your email...</p>}
            {status === 'success' && <p style={{ color: 'green' }}>Email verified successfully! Redirecting to login...</p>}
            {status === 'error' && <p style={{ color: 'red' }}>Invalid or expired verification link.</p>}
        </div>
    );
};

export default VerifyEmail;
