import React, { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import './Contact.css'
import mail_icon from '../assets/edusity_assets/mail-icon.png'
import phone_icon from '../assets/edusity_assets/phone-icon.png'
import white_arrow from '../assets/edusity_assets/white-arrow.png'
import { useState } from 'react'
import axiosInstance from '../utils/axios'
import axios from 'axios'

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

function Contact() {
  const [result, setResult] = useState("");
  const [Data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    message: ""
  })
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef(null);
  const locationInputRef = useRef(null);
  const handleChange = (event) => {
    const { name, value } = event.target
    setData(prev => ({
      ...prev,
      [name]: value

    }))
    if (name === 'location') {
      setLocationSearchTerm(value);
    }
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    if (!locationSearchTerm || locationSearchTerm.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
          params: {
            text: locationSearchTerm,
            filter: 'countrycode:np',
            limit: 15,
            apiKey: GEOAPIFY_API_KEY,
          },
        });

        const suggestions = response.data.features.map(feature => ({
          formatted: feature.properties.formatted,
          lat: feature.properties.lat,
          lng: feature.properties.lon,
        }));

        setLocationSuggestions(suggestions);
        setShowLocationDropdown(suggestions.length > 0);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [locationSearchTerm]);
  const handleLocationSelect = (location) => {
    setData(prev => ({
      ...prev,
      location: location.formatted,
    }));
    setLocationSearchTerm(location.formatted);
    setShowLocationDropdown(false);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", import.meta.env.VITE_ACCESS_KEY);


    try {
      const give = await axiosInstance.post('/freelance/add', Data)
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setResult("Form Submitted Successfully, please wait our team will contact shortly");
        event.target.reset();
        setData({
          name: "",
          phone: "",
          email: "",
          location: "",
          message: ""
        })
      } else {
        console.log("Error", data);
        setResult(data.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);

      setResult("Network error. Please check your connection and try again.");
    }
  };

  return (
    <main className='contact' itemScope itemType="https://schema.org/ContactPage">
      <Helmet>
        <meta name="description" content="Join our team of freelance photographers or get in touch with us. We'd love to hear from you about your photography needs." />
        <meta property="og:title" content="Contact Us | Join as Freelance Photographer" />
        <meta property="og:description" content="Join our team of freelance photographers or get in touch with us." />
        <meta name="keywords" content="freelance photographer, photography contact, join photography team, photographer hiring" />
      </Helmet>

      <section className="contact-col" aria-label="Contact information">
        <h1>Join us as a freelancing photographer </h1>
        <p>Feel free to reach out through our contact form or direct contact information below.</p>
        <address>
          <ul className='contact-info-list'>
            <li>
              <img src={mail_icon} alt="Email icon" aria-hidden="true" />
              <a href="mailto:paudelabinash58@gmail.com" itemProp="email">paudelabinash58@gmail.com</a>
            </li>
            <li>
              <img src={phone_icon} alt="Phone icon" aria-hidden="true" />
              <a href="tel:+9779766004113" itemProp="telephone">+977 976 600 4113</a>
            </li>
          </ul>
        </address>
      </section>

      <section className="contact-col" aria-label="Contact form">
        <form onSubmit={onSubmit} itemScope itemType="https://schema.org/ContactForm">
          <div className="form-group">
            <label htmlFor="name">Your name</label>
            <input
              type="text"
              id="name"
              name='name'
              placeholder='Enter your name'
              required
              itemProp="name"
              aria-required="true"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone number</label>
            <input
              type="tel"
              id="phone"
              name='phone'
              placeholder='Enter your phone number'
              required
              itemProp="telephone"
              onChange={handleChange}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <div className="dropdown-container">
                <input
                  ref={locationInputRef}
                  type="text"
                  id="location"
                  name="location"
                  value={Data.location}
                  onChange={handleChange}
                  className="dropdown-input"
                  placeholder="e.g. Kathmandu"
                  autoComplete="off"
                  onFocus={() => setShowLocationDropdown(locationSearchTerm.length > 0)}
                  itemProp="address"
                />
                {showLocationDropdown && (
                  <div className="dropdown-list" ref={locationDropdownRef}>
                    {locationSuggestions.length > 0 ? (
                      locationSuggestions.map((loc, i) => (
                        <div
                          key={i}
                          className={`dropdown-item ${Data.location === loc.formatted ? "active" : ""}`}
                          onClick={() => handleLocationSelect(loc)}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {loc.formatted}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-no-results">
                        {locationSearchTerm ? "No matches found" : "Start typing to search"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name='email'
              placeholder='Enter your Email id'
              required
              itemProp="email"
              aria-required="true"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Write your message here</label>
            <textarea
              id="message"
              name="message"
              rows="10"
              placeholder='Enter your message and your device model name to click picture'
              itemProp="message"
              aria-required="false"
              onChange={handleChange}
            ></textarea>
          </div>

          <button type='submit' className='btn dark-btn'>
            Submit <img src={white_arrow} alt="" aria-hidden="true" />
          </button>

          <div
            className="form-result"
            role="status"
            aria-live="polite"
          >
            {result}
          </div>
        </form>
      </section>
    </main>
  )
}

export default Contact