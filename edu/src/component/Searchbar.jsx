import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import './Searchbar.css';

const OPENCAGE_API_KEY = 'e9dc05bc97ad4b048d796966fedc7fb0'; // your API key here

const Searchbar = ({ onPlaceSelect }) => {
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        location: "",
        coordinate: { lat: "", lon: "" }
    });

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle Enter key to select first result or search
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (filteredPlaces.length > 0) {
                    handlePlaceSelect(filteredPlaces[0]);
                } else {
                    handleSearch();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredPlaces, formData]);

    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2) {
            setFilteredPlaces([]);
            setShowDropdown(false);
            return;
        }

        const fetchPlaces = async () => {
            try {
                const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                    params: {
                        key: OPENCAGE_API_KEY,
                        q: `${searchTerm} Kathmandu`,
                        countrycode: 'np',
                        limit: 10,
                    },
                });

                const results = response.data.results.map(place => ({
                    id: place.annotations?.geohash || place.formatted + place.geometry.lat + place.geometry.lng,
                    properties: { name: place.formatted },
                    geometry: {
                        coordinates: [place.geometry.lng, place.geometry.lat]
                    }
                }));

                setFilteredPlaces(results);
                setShowDropdown(results.length > 0);
            } catch (error) {
                console.error("Failed to fetch places:", error);
                setFilteredPlaces([]);
                setShowDropdown(false);
            }
        };

        const debounceTimer = setTimeout(fetchPlaces, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'location') {
            setSearchTerm(value);
        }
    };

    const handleSearch = () => {
        if (formData.location.trim()) {
            onPlaceSelect(formData);
            setShowDropdown(false);
        }
    };

    const handlePlaceSelect = (place) => {
        const selectedPlace = {
            location: place.properties.name,
            coordinate: {
                lat: place.geometry.coordinates[1],
                lon: place.geometry.coordinates[0]
            }
        };

        setFormData(selectedPlace);
        setSearchTerm(place.properties.name);
        setShowDropdown(false);
        onPlaceSelect?.(selectedPlace);
    };

    const clearSearch = () => {
        setFormData({ location: "", coordinate: { lat: "", lon: "" } });
        setSearchTerm("");
        setShowDropdown(false);
        onPlaceSelect?.(null);
    };

    return (
        <div className="searchbar-wrapper">
            <div className="searchbar-container">
                <div className="searchbar-input-group">
                    <div className="search-icon">
                        <FiSearch />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="searchbar-input"
                        placeholder="Search by location..."
                        autoComplete="off"
                        onFocus={() => setShowDropdown(searchTerm.length > 0)}
                    />
                    {formData.location && (
                        <button className="clear-button" onClick={clearSearch}>
                            <FiX />
                        </button>
                    )}
                    <button
                        className="search-button"
                        onClick={handleSearch}
                        disabled={!formData.location.trim()}
                    >
                        Search
                    </button>
                </div>

                {showDropdown && (
                    <div className="searchbar-dropdown" ref={dropdownRef}>
                        {filteredPlaces.length > 0 ? (
                            <ul className="dropdown-list">
                                {filteredPlaces.map((place) => (
                                    <li
                                        key={place.id}
                                        className="dropdown-item"
                                        onClick={() => handlePlaceSelect(place)}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        <FiMapPin className="item-icon" />
                                        <span className="item-text">{place.properties.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="dropdown-empty">
                                {searchTerm ? "No locations found" : "Type to search locations"}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Searchbar;
