import React, { useEffect, useState } from 'react';
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
    Rooms: "",
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
        console.error("Locationlocation lookup error:", e);
        setLocationSuggestions([]);
      }
    };

    const id = setTimeout(fetchLocations, 300);
    return () => clearTimeout(id);
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
      navigate('-1')
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setAlertMessage("Failed to update hostel.");
    } finally {
      setIsSubmitting(false);
      setShowAlert(true);

    }
  };

  const closeAlert = () => setShowAlert(false);

  return (
    <div className="gharbeti-container">
      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-container">
            <div className={`alert-icon ${isSuccess ? 'success' : 'error'}`}>
              {isSuccess ? '✓' : '!'}
            </div>
            <div className="alert-message">{alertMessage}</div>
            <button className="alert-button" onClick={closeAlert}>
              OK
            </button>
          </div>
        </div>
      )}

      <div className="form-wrapper">
        <header className="form-header">
          <button onClick={() => navigate(-1)} className="back">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="form-title">Gharbeti</h1>
          <p className="form-subtitle">Edit hostel property details</p>
        </header>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Hostel Name <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={data.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Sunshine Villa"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location <span className="required">*</span>
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
                  onFocus={() =>
                    setShowLocationDropdown(locationSearchTerm.length > 0)
                  }
                />
                {showLocationDropdown && (
                  <div className="dropdown-list">
                    {locationSuggestions.length ? (
                      locationSuggestions.map((loc, i) => (
                        <div
                          key={i}
                          className={`dropdown-item ${data.location === loc.formatted ? "active" : ""
                            }`}
                          onClick={() => handleLocationSelect(loc)}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {loc.formatted}
                        </div>
                      ))
                    ) : (
                      <div className="no-results">
                        {locationSearchTerm ? "No matches found" : "Start typing"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="Rooms" className="form-label">
                Rooms available <span className="required">*</span>
              </label>
              <input
                type="number"
                id="Rooms"
                name="Rooms"
                min="1"
                value={data.Rooms}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. 5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact_no" className="form-label">
                Contact number <span className="required">*</span>
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Monthly price (NPR) <span className="required">*</span>
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Property Description <span>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Describe your property in detail..."
                required
                rows="6"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : 'Update Hostel'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditDetails;
