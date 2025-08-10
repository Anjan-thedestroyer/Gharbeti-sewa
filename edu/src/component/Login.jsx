import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import './Login.css';
import axiosInstance from '../utils/axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        '/user/login',
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.data.accesstoken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed. Try again.');
        setShowAlert(true);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'An error occurred. Please try again.'
      );
      console.log(error)
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Login | Gharbeti-sewa</title>
        <meta name="description" content="Log in to your account to access exclusive features and manage your properties." />
        <meta property="og:title" content="Login | Gharbeti-sewa" />
        <meta property="og:description" content="Log in to your account to access exclusive features and manage your properties." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <link rel="canonical" href={`${window.location.origin}/login`} />
      </Helmet>

      <main className="login-page-container">
        <div className="login-container">
          {/* Back Button */}
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
          >
            <FiArrowLeft size={24} />
          </button>

          {/* Alert Container */}
          {showAlert && (
            <div className="alert-overlay" role="alert">
              <div className="alert-container">
                <div className="alert-message">{error}</div>
                <button
                  className="alert-button"
                  onClick={closeAlert}
                  aria-label="Close error message"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          <div className="login-card">
            <h1 className="login-title">Log In to Your Account</h1>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                  <span className="required-field" aria-hidden="true"> *</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter your email"
                  autoComplete="username"
                  aria-required="true"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                  <span className="required-field" aria-hidden="true"> *</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                  minLength="6"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-required="true"
                />
              </div>

              <div className="forgot-password-link">
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate('/forgot-password')}
                  aria-label="Forgot password"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    <span>Logging in...</span>
                  </>
                ) : 'Log In'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <button
                  className="link-button"
                  onClick={() => navigate('/register')}
                  aria-label="Register new account"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;