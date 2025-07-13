import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
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
        localStorage.setItem('accesstoken', response.data.data.accesstoken);
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
    <div className="login-page-container">
      <div className="login-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft size={24} />
        </button>

        {/* Alert Container */}
        {showAlert && (
          <div className="alert-overlay">
            <div className="alert-container">
              <div className="alert-message">{error}</div>
              <button
                className="alert-button"
                onClick={closeAlert}
              >
                OK
              </button>
            </div>
          </div>
        )}

        <div className="login-card">
          <h2 className="login-title">Log In</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
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
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : 'Log In'}
            </button>
          </form>

          <div className="login-footer">
            Don't have an account?{' '}
            <button
              className="link-button"
              onClick={() => navigate('/register')}
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;