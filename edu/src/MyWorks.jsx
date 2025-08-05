import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HostelController from './component/HostelController';
import Navbar from './component/Navbar';

const MyWorks = () => {
    useEffect(() => {
        document.title = "Manage Your Hostel Listings | Gharbeti";
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Hostel Management Dashboard",
        "description": "Manage and update your hostel listings on Gharbeti platform",
        "potentialAction": {
            "@type": "UpdateAction",
            "target": window.location.href,
            "description": "Manage hostel listings"
        }
    };

    return (
        <>
            <Helmet>
                <title>Manage Your Hostel Listings | Gharbeti</title>
                <meta name="description" content="Access and manage all your hostel listings in one place. Update information, photos, and availability." />
                <meta property="og:title" content="Manage Your Hostel Listings | Gharbeti" />
                <meta property="og:description" content="Hostel owner dashboard for managing your property listings on Gharbeti" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={`${window.location.origin}/my-works`} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <div itemScope itemType="https://schema.org/WebPage">
                <Navbar color='no' />
                <HostelController />
            </div>
        </>
    );
};

export default MyWorks;