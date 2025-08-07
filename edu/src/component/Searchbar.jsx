import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import './Searchbar.css';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
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
                // GEOAPIFY autocomplete API with Nepal country filter
                const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
                    params: {
                        text: `${searchTerm} Nepal`,
                        filter: 'countrycode:np',
                        limit: 10,
                        apiKey: GEOAPIFY_API_KEY,
                    },
                });

                // Map Geoapify results into your existing format
                const results = response.data.features.map(feature => ({
                    id: feature.properties.place_id || feature.properties.formatted + feature.geometry.coordinates.join(','),
                    properties: {
                        name: feature.properties.formatted,
                        city: feature.properties.city || feature.properties.town || feature.properties.suburb || '',
                        region: feature.properties.state || '',
                    },
                    geometry: {
                        coordinates: feature.geometry.coordinates,
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
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            location: value,
        }));
        setSearchTerm(value);
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
            city: place.properties.city,
            region: place.properties.region,
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
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": `${window.location.origin}/search?q={search_term}`,
                            "query-input": "required name=search_term"
                        }
                    })}
                </script>
            </Helmet>

            <div className="searchbar-wrapper" itemScope itemType="https://schema.org/WebSite">
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
                            placeholder="Search locations in Nepal..."
                            autoComplete="off"
                            aria-label="Search for locations in Nepal"
                            onFocus={() => setShowDropdown(searchTerm.length > 0)}
                            itemProp="query-input"
                        />
                        {formData.location && (
                            <button
                                className="clear-button"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                <FiX />
                            </button>
                        )}
                        <button
                            className="search-button"
                            onClick={handleSearch}
                            disabled={!formData.location.trim()}
                            aria-label="Search locations"
                            itemProp="potentialAction"
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
                                            itemScope
                                            itemType="https://schema.org/Place"
                                        >
                                            <FiMapPin className="item-icon" />
                                            <span className="item-text" itemProp="name">
                                                {place.properties.name}
                                            </span>
                                            <meta itemProp="latitude" content={place.geometry.coordinates[1]} />
                                            <meta itemProp="longitude" content={place.geometry.coordinates[0]} />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="dropdown-empty">
                                    {searchTerm ? "No locations found" : "Type to search locations in Nepal"}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Searchbar;
