import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Correct import
import './Register.css';

const Register = () => {
  const navigate = useNavigate(); // Corrected hook name

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/register',
        formData
      );
      if (response.data.success) {
        setSuccess('User is registered successfully. Now you can verify it.');
        setFormData({ name: '', email: '', password: '' });
        setLoading(false);
        navigate('/verify')
      } else {
        setError(response.data.message || 'Registration failed. Try again.');
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="register-form-container">
      <h2>Register your email here</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
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
    </div>
  );
};

export default Register;
