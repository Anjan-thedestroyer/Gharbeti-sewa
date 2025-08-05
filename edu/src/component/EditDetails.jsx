import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axiosInstance from '../utils/axios';
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axios from 'axios';

const OPENCAGE_API_KEY = "e9dc05bc97ad4b048d796966fedc7fb0";

const EditDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    location: "",
    room: "",
    contact_no: "",
    email: "",
    price: "",
    description: ""
  });

  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch hostel data by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`hostels/get/${id}`);
        setData(response.data.data);
        setLocationSearchTerm(response.data.data.location || "");
      } catch (error) {
        console.error(error);
        setAlertMessage("Failed to load hostel data");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fetch location suggestions
  useEffect(() => {
    if (!locationSearchTerm || locationSearchTerm.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    const fetchLocations = async () => {
      try {
        const { data } = await axios.get(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              key: OPENCAGE_API_KEY,
              q: `${locationSearchTerm} Kathmandu`,
              countrycode: "np",
              limit: 10,
            },
          }
        );
        const suggestions = data.results.map((place) => ({
          formatted: place.formatted,
          lat: place.geometry.lat,
          lon: place.geometry.lng,
        }));
        setLocationSuggestions(suggestions);
        setShowLocationDropdown(suggestions.length > 0);
      } catch (e) {
        console.error("Location lookup error:", e);
        setLocationSuggestions([]);
      }
    };

    const timerId = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timerId);
  }, [locationSearchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (name === "location") setLocationSearchTerm(value);
  };

  const handleLocationSelect = (loc) => {
    setData((prev) => ({
      ...prev,
      location: loc.formatted,
      coordinate: { lat: loc.lat, lon: loc.lon },
    }));
    setLocationSearchTerm(loc.formatted);
    setShowLocationDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.put(`hostels/edit-details/${id}`, data);
      setIsSuccess(true);
      setAlertMessage("Hostel updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setAlertMessage(error.response?.data?.message || "Failed to update hostel.");
    } finally {
      setIsSubmitting(false);
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    if (isSuccess) {
      navigate(-1);
    }
  };

  return (
    <main className="gharbeti-container" itemScope itemType="https://schema.org/LodgingBusiness">
      <Helmet>
        <title>Edit Hostel Details | Gharbeti</title>
        <meta name="description" content="Edit your hostel property details including location, room, pricing and contact information." />
        <meta property="og:title" content="Edit Hostel Details | Gharbeti" />
        <meta property="og:description" content="Update your hostel listing information on Gharbeti." />
        <meta name="keywords" content="edit hostel, update property, hostel management, Nepal hostels" />
      </Helmet>

      {showAlert && (
        <div className="alert-overlay" role="alert" aria-live="assertive">
          <div className="alert-container">
            <div className={`alert-icon ${isSuccess ? 'success' : 'error'}`} aria-hidden="true">
              {isSuccess ? '✓' : '!'}
            </div>
            <div className="alert-message">{alertMessage}</div>
            <button
              className="alert-button"
              onClick={closeAlert}
              aria-label="Close alert"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="form-wrapper">
        <header className="form-header">
          <button
            onClick={() => navigate(-1)}
            className="back"
            aria-label="Go back"
          >
            <FiArrowLeft size={20} aria-hidden="true" />
          </button>
          <h1 className="form-title" itemProp="name">Edit Hostel Details</h1>
          <p className="form-subtitle">Update your property information</p>
        </header>

        {loading ? (
          <div className="loading" aria-live="polite">Loading hostel details...</div>
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Hostel Name <span className="required" aria-hidden="true">*</span>
                <span className="sr-only">required</span>
              </label>
              <input
                id="name"
                name="name"
                value={data.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Sunshine Villa"
                required
                itemProp="name"
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location <span className="required" aria-hidden="true">*</span>
                <span className="sr-only">required</span>
                <span className="hint">(nearest if exact isn't found)</span>
              </label>
              <div className="dropdown-container">
                <input
                  id="location"
                  name="location"
                  value={locationSearchTerm}
                  onChange={handleInputChange}
                  className="dropdown-input"
                  placeholder="e.g. Dillibazar, Kathmandu"
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls="location-suggestions"
                  aria-expanded={showLocationDropdown}
                  onFocus={() => setShowLocationDropdown(locationSearchTerm.length > 0)}
                  required
                  aria-required="true"
                  itemProp="address"
                />
                {showLocationDropdown && (
                  <ul
                    id="location-suggestions"
                    className="dropdown-list"
                    role="listbox"
                  >
                    {locationSuggestions.length ? (
                      locationSuggestions.map((loc, i) => (
                        <li
                          key={i}
                          className={`dropdown-item ${data.location === loc.formatted ? "active" : ""}`}
                          onClick={() => handleLocationSelect(loc)}
                          onMouseDown={(e) => e.preventDefault()}
                          role="option"
                          aria-selected={data.location === loc.formatted}
                        >
                          {loc.formatted}
                        </li>
                      ))
                    ) : (
                      <li className="no-results" role="option">
                        {locationSearchTerm ? "No matches found" : "Start typing"}
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <style>

            </style>
            <div className="form-group">
              <label htmlFor="room" className="form-label">
                room available <span className="required" aria-hidden="true">*</span>
                <span className="sr-only">required</span>
              </label>
              <input
                type="number"
                id="room"
                name="room"
                min="1"
                value={data.room}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. 5"
                required
                aria-required="true"
                itemProp="numberOfroom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact_no" className="form-label">
                Contact number <span className="required" aria-hidden="true">*</span>
                <span className="sr-only">required</span>
              </label>
              <input
                type="tel"
                id="contact_no"
                name="contact_no"
                value={data.contact_no}
                onChange={handleInputChange}
                className="form-input"
                placeholder="98########"
                required
                aria-required="true"
                itemProp="telephone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                E-mail (optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="info@example.com"
                itemProp="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Monthly price (NPR) <span className="required" aria-hidden="true">*</span>
                <span className="sr-only">required</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                value={data.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. 15000"
                required
                aria-required="true"
                itemProp="priceRange"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Property Description <span aria-hidden="true">*</span>
                <span className="sr-only">required</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Describe your property in detail..."
                rows="6"
                aria-required="true"
                itemProp="description"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  <span aria-live="polite">Submitting...</span>
                </>
              ) : 'Update Hostel'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default EditDetails;

