import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from './component/Navbar';
import './index.css';
import Hero from './component/Hero';
import Programs from './component/Programs';
import Title from './component/Title';
import Campus from './component/Campus';
import Contact from './component/Contact';
import Footer from './component/Footer';
import About from './component/About';

const Main = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Gharbeti",
        "url": window.location.href,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term}`,
            "query-input": "required name=search_term"
        }
    };

    const organizationStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Gharbeti",
        "url": window.location.origin,
        "logo": `${window.location.origin}/logo.png`,
        "description": "Student accommodation platform connecting students with verified hostels and rental properties",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+977-XXXXXXXXXX",
            "contactType": "customer service"
        }
    };

    return (
        <>
            <Helmet>
                <meta name="description" content="Find verified hostels and rental properties for students across Nepal. Zero commission for students with Gharbeti." />
                <meta property="og:title" content="Gharbeti - Student Accommodation Platform" />
                <meta property="og:description" content="Connecting students with safe, verified hostels and rental properties across Nepal" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={window.location.href} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(organizationStructuredData)}
                </script>
            </Helmet>

            <div className="main-container" itemScope itemType="https://schema.org/WebPage">
                <Navbar />
                <div className="content-wrapper">
                    <Hero />
                    <div className="container">
                        <Title subTitle='Wanna add hostel' title='Add now' />
                        <About />
                        <Title subTitle='Our PROGRAM' title='What We Offer' />
                        <Programs />

                        <Title subTitle='ZERO charges' title='for students' />
                        <Campus />

                        <Title subTitle='Contact US' title='GEt in touch' />
                        <Contact />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Main;