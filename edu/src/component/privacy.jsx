import React, { useEffect } from "react";
import { Helmet } from 'react-helmet';
import './legal.css';

const Privacy = () => {
    useEffect(() => {
        document.title = "Privacy Policy | Gharbeti-sewa";
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy",
        "description": "Our commitment to protecting your personal information and data privacy practices.",
        "publisher": {
            "@type": "Organization",
            "name": "Gharbeti-sewa",
            "logo": {
                "@type": "ImageObject",
                "url": "https://yourwebsite.com/logo.png"
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>Privacy Policy | Gharbeti-sewa</title>
                <meta name="description" content="Learn how we collect, use, and protect your personal information. Read our comprehensive privacy policy." />
                <meta property="og:title" content="Privacy Policy | Gharbeti-sewa" />
                <meta property="og:description" content="Our commitment to protecting your personal information and data privacy practices." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={`${window.location.origin}/privacy-policy`} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <main className="legal-wrapper" itemScope itemType="https://schema.org/PrivacyPolicy">
                <article>
                    <h1 itemProp="headline">Privacy Policy</h1>
                    <p itemProp="datePublished"><strong>Effective Date:</strong> January 30, 2025</p>
                    <p itemProp="description">This Privacy Policy describes how we collect, use, and protect your personal information when you use our services.</p>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">1. Introduction</h2>
                        <p itemProp="text">At Gharbeti-sewa, we value your privacy and are committed to protecting your personal data in compliance with applicable privacy laws.</p>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">2. Information We Collect</h2>
                        <p>We collect several types of information:</p>
                        <ul>
                            <li itemProp="itemListElement"><strong>Personal Information:</strong> Name, phone number, email address, contact details</li>
                            <li itemProp="itemListElement"><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
                            <li itemProp="itemListElement"><strong>Media Files:</strong> Images uploaded for property listings</li>
                            <li itemProp="itemListElement"><strong>Usage Data:</strong> How you interact with our website and services</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">3. Purpose of Collection</h2>
                        <p itemProp="text">We use your information to:</p>
                        <ul>
                            <li>Provide and maintain our services</li>
                            <li>Create and manage user accounts</li>
                            <li>Process property listings and transactions</li>
                            <li>Improve our website and services</li>
                            <li>Communicate with users</li>
                            <li>Prevent fraud and ensure security</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">4. Data Sharing and Disclosure</h2>
                        <p itemProp="text">We do not sell your personal information. Data may be shared with:</p>
                        <ul>
                            <li>Service providers (hosting, analytics)</li>
                            <li>Legal authorities when required by law</li>
                            <li>Business partners with your consent</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">5. Cookies and Tracking Technologies</h2>
                        <p itemProp="text">We use cookies and similar technologies for:</p>
                        <ul>
                            <li>Authentication and security</li>
                            <li>Remembering preferences</li>
                            <li>Analyzing website traffic</li>
                            <li>Improving user experience</li>
                        </ul>
                        <p>You can manage cookie preferences in your browser settings.</p>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">6. Data Security</h2>
                        <p itemProp="text">We implement security measures including:</p>
                        <ul>
                            <li>SSL encryption</li>
                            <li>Firewall protection</li>
                            <li>Regular security audits</li>
                            <li>Limited access to personal data</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">7. Data Retention</h2>
                        <p itemProp="text">We retain personal data:</p>
                        <ul>
                            <li>As long as your account is active</li>
                            <li>As required by law</li>
                            <li>For legitimate business purposes</li>
                        </ul>
                        <p>You may request deletion of your data at any time.</p>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">8. Your Rights</h2>
                        <p itemProp="text">You have the right to:</p>
                        <ul>
                            <li>Access your personal data</li>
                            <li>Request correction or deletion</li>
                            <li>Object to processing</li>
                            <li>Request data portability</li>
                            <li>Withdraw consent</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">9. Children's Privacy</h2>
                        <p itemProp="text">Our services are not directed to children under 13. We do not knowingly collect personal information from children.</p>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">10. Policy Updates</h2>
                        <p itemProp="text">We may update this policy periodically. Significant changes will be communicated through our website or email.</p>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">11. Contact Information</h2>
                        <address itemProp="address" itemType="https://schema.org/PostalAddress">
                            <p>For privacy-related inquiries:</p>
                            <p><strong>Email:</strong> <a href="mailto:paudelabinash58@gmail.com" itemProp="email">paudelabinash58@gmail.com</a></p>
                            <p><strong>Phone:</strong> <a href="tel:+9779766004113" itemProp="telephone">+977-9766004113</a></p>
                        </address>
                    </section>
                </article>
            </main>
        </>
    );
};

export default Privacy;