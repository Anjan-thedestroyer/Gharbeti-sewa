import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axiosInstance from '../utils/axios';
import { useParams } from 'react-router-dom';
import PropertyDetail from './PropertyDetail';
import './ListGhar.css';

const ListGhar = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lands, setLands] = useState([]);
    const [sortPrice, setSortPrice] = useState(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [isHostel, setIsHostel] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setIsHostel(id === "hostel");
    }, [id]);

    useEffect(() => {
        if (data) {
            searchByAddress(data);
        }
    }, [data, isHostel]);

    const searchByAddress = async (location) => {
        setLoading(true);
        setError("");
        setLands([]);
        setSortPrice(null);
        setSelectedPropertyId(null);

        try {
            const url = isHostel ? '/hostels/by-address' : '/landlords/verified/by-address';
            const response = await axiosInstance.get(url, {
                params: { location }
            });
            setLands(response.data.data);
            console.log(response.data)
        } catch (error) {
            console.error("Search error:", error);
            setError("Failed to fetch properties. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSortByPrice = (order) => {
        if (lands.length === 0) return;

        setLands(prevLands => {
            const sortedLands = [...prevLands].sort((a, b) => {
                const priceA = a.price || 0;
                const priceB = b.price || 0;
                return order === 1 ? priceA - priceB : priceB - priceA;
            });
            return sortedLands;
        });

        setSortPrice(order);
    };

    const handlePropertyClick = (propertyId) => {
        setSelectedPropertyId(propertyId);
    };

    const handleCloseDetail = () => {
        setSelectedPropertyId(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateArea = (width, length) => {
        if (width && length) return width * length;
        return null;
    };

    const pageTitle = `${isHostel ? 'Hostel' : 'Property'} Listings in ${data || 'Nepal'}`;
    const pageDescription = `Browse ${isHostel ? 'hostel' : 'property'} listings in ${data || 'various locations'}. 
                            Find verified ${isHostel ? 'hostels' : 'properties'} with prices, locations, and contact information.`;

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={`${window.location.origin}/${isHostel ? 'hostels' : 'properties'}/${data || ''}`} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                {lands[0]?.image?.[0] && <meta property="og:image" content={lands[0].image[0]} />}
            </Helmet>

            {lands.length > 0 && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": lands.map((land, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": isHostel ? "Hostel" : "House",
                                "name": land.location,
                                "description": land.description || `Property in ${land.location}`,
                                "image": land.image?.[0],
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": land.location
                                },
                                "offers": {
                                    "@type": "Offer",
                                    "price": land.price,
                                    "priceCurrency": "NPR"
                                }
                            }
                        }))
                    })}
                </script>
            )}

            <main className="list-ghar-container">
                <h1 className="page-title">{pageTitle}</h1>

                {error && <div className="error-message" role="alert">{error}</div>}

                <div className="sort-options">
                    <span className="sort-label">Sort by price:</span>
                    <button
                        onClick={() => handleSortByPrice(1)}
                        className={`sort-button ${sortPrice === 1 ? 'active' : ''}`}
                    >
                        Ascending
                    </button>
                    <button
                        onClick={() => handleSortByPrice(-1)}
                        className={`sort-button ${sortPrice === -1 ? 'active' : ''}`}
                    >
                        Descending
                    </button>
                </div>

                <div className="results-container">
                    {loading ? (
                        <div className="loading-spinner">
                            Loading properties in {data}...
                        </div>
                    ) : lands.length > 0 ? (
                        <section className="property-grid">
                            {lands.map(land => {
                                const area = calculateArea(land.width, land.length);
                                return (
                                    <article
                                        key={land._id}
                                        className="property-card"
                                        onClick={() => handlePropertyClick(land._id)}
                                    >
                                        <div className="property-image-container">
                                            {land.image?.[0] ? (
                                                <img
                                                    src={land.image[0]}
                                                    alt={`${land.location} ${isHostel ? 'hostel' : 'property'} in ${data}`}
                                                    className="property-image"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/600x400?text=Property+Image';
                                                    }}
                                                />
                                            ) : (
                                                <div className="property-image-placeholder">
                                                    Image not available
                                                </div>
                                            )}
                                            <div className="property-status">
                                                {land.sold && <span className="status-badge sold">Sold</span>}
                                                {!isHostel && Number(land.shutter) > 0 && <span className="status-badge verified">Has Shutter</span>}
                                            </div>
                                        </div>
                                        <div className="property-details">
                                            <header className="property-header">
                                                <h2 className="property-location">{land.location}</h2>
                                                <div className="property-price">
                                                    <span>{land.price?.toLocaleString() || 'Price on request'}</span>
                                                </div>
                                            </header>

                                            <div className="property-meta">
                                                <div className="meta-item">
                                                    <span className="meta-label">Listed by:</span>
                                                    <span className="meta-value">{land.name || 'Owner'}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-label">Posted:</span>
                                                    <span className="meta-value">{formatDate(land.createdAt)}</span>
                                                </div>
                                            </div>

                                            <div className="property-description">
                                                {land.description || 'No detailed description provided for this property.'}
                                            </div>

                                            <div className="property-specs">
                                                <div className="specs-grid">
                                                    {(land.room || land.Rooms || land.rooms !== 0) && (
                                                        <div className="spec-item">
                                                            <span className="spec-value">{land.room || land.Rooms || land.rooms}</span>
                                                            <span className="spec-label">Room</span>
                                                        </div>
                                                    )}
                                                    {!isHostel && Number(land.shutter) > 0 && (
                                                        <div className='spec-item'>
                                                            <span className="spec-value">{land.shutter}</span>
                                                            <span className="spec-label">No of Shutter</span>
                                                        </div>
                                                    )}
                                                    {land.bathroom && (
                                                        <div className="spec-item">
                                                            <span className="spec-value">{land.bathroom}</span>
                                                            <span className="spec-label">Bathrooms</span>
                                                        </div>
                                                    )}
                                                    {area && (
                                                        <div className="spec-item">
                                                            <span className="spec-value">{area} sq.ft.</span>
                                                            <span className="spec-label">Total Area</span>
                                                        </div>
                                                    )}
                                                    {land.width && land.length && (
                                                        <div className="spec-item">
                                                            <span className="spec-value">{land.width} × {land.length}</span>
                                                            <span className="spec-label">Dimensions</span>
                                                        </div>
                                                    )}
                                                    {land.Applicants !== 0 && (
                                                        <div className="spec-item">
                                                            <span className="spec-value">{land.Applicants}</span>
                                                            <span className="spec-label">Number of people applied</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>
                    ) : (
                        <div className="no-results">
                            {data ? (
                                <>
                                    No properties currently available in {data}.
                                    Try <a href={`/${isHostel ? 'hostels' : 'properties'}`}>browse all {isHostel ? 'hostels' : 'properties'}</a> or
                                    <a href="/contact"> contact us</a> for assistance.
                                </>
                            ) : (
                                <>
                                    Enter a location to search for properties or browse our
                                    <a href={`/${isHostel ? 'hostels' : 'properties'}`}> featured listings</a>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {selectedPropertyId && (
                    <PropertyDetail
                        propertyId={selectedPropertyId}
                        onClose={handleCloseDetail}
                        type={id}
                    />
                )}
            </main>
        </>
    );
};

export default ListGhar;
