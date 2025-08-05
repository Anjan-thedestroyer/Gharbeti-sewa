import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from './component/Navbar';
import Searchbar from './component/Searchbar';
import ListGhar from './component/ListGhar';
import './Buyer.css';

const Buyer = () => {
    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {
        document.title = "Find Hostels & Rental Properties | Gharbeti";
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Property Search",
        "description": "Find verified hostels and rental properties across Nepal",
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?location={search_term}`,
            "query-input": "required name=search_term"
        }
    };

    return (
        <>
            <Helmet>
                <title>Find Hostels & Rental Properties | Gharbeti</title>
                <meta name="description" content="Browse verified hostels and rental properties across Nepal. Find your perfect accommodation with detailed listings and contact information." />
                <meta property="og:title" content="Find Hostels & Rental Properties | Gharbeti" />
                <meta property="og:description" content="Search and discover verified rental properties and hostels in your desired location in Nepal" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={`${window.location.origin}/buyer`} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <div className='main' itemScope itemType="https://schema.org/WebPage">
                <div className='nav'><Navbar color='no' /></div>
                <Searchbar onPlaceSelect={(data) => setSelectedAddress(data.location)} />
                <ListGhar data={selectedAddress} />
            </div>
        </>
    );
};

export default Buyer;