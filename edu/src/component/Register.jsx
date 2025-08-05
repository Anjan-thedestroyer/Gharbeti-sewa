import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axiosInstance from '../utils/axios';
import { Helmet } from 'react-helmet';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        '/user/register',
        formData
      );
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Registration failed. Try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Register | Gharbeti-sewa</title>
        <meta name="description" content="Create your account to access exclusive features. Verify your email to complete registration." />
        <meta property="og:title" content="Register | Gharbeti-sewa" />
        <meta property="og:description" content="Join our platform by creating an account. Email verification required." />
        <link rel="canonical" href={`${window.location.origin}/register`} />
      </Helmet>

      <div className="register-form-container">
        {success ? (
          <div className="verification-message">
            <h2>Verify Your Email</h2>
            <p>We've sent a verification link to <strong>{formData.email}</strong></p>
            <div className="verification-instructions">
              <p>Please check your inbox and:</p>
              <ol>
                <li>Open the email from us</li>
                <li>Click the verification link</li>
                <li>Return to login</li>
              </ol>
              <p className="note">Didn't receive it? Check your spam folder or <button className="resend-button" onClick={handleSubmit}>Resend verification</button></p>
            </div>
            <button className="submit-button" onClick={handleNavigation}>
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h2>Register your email here</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <h5>
              Already have an account?{' '}
              <button className="link-button" onClick={handleNavigation}>
                Log in
              </button>
            </h5>
          </>
        )}
      </div>
    </>
  );
};

export default Register;