import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axios'

const ForgotPassword = () => {
    const [data, setData] = useState({ email: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validValue = emailRegex.test(data.email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axiosInstance.put('/user/forgot-password', data);
            if (response.data.success) {
                setMessage("OTP sent successfully.");
                navigate("/verification-otp", { state: data });
                setData({ email: "" });
            }
        } catch (error) {
            setMessage(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className=''>
            <div className=''>
                <p className=''>Forgot Password</p>
                {message && <p className="text-red-500">{message}</p>}
                <form className='' onSubmit={handleSubmit}>
                    <div className=''>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            className=''
                        />
                    </div>
                    <button disabled={!validValue || loading} className="">
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ForgotPassword;
