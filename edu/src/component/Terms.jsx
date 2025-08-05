import React, { useEffect } from "react";
import { Helmet } from 'react-helmet';
import './legal.css';

const Terms = () => {
    useEffect(() => {
        document.title = "Terms of Service | Ghar Beti Sewa";
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms of Service",
        "description": "Legal terms governing the use of Ghar Beti Sewa platform",
        "datePublished": "2025-01-30",
        "publisher": {
            "@type": "Organization",
            "name": "Ghar Beti Sewa",
            "url": window.location.href,
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "paudelabinash58@gmail.com",
                "telephone": "+977-9766004113"
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>Terms of Service | Ghar Beti Sewa</title>
                <meta name="description" content="Legal terms and conditions for using Ghar Beti Sewa's property rental platform in Nepal" />
                <meta property="og:title" content="Terms of Service | Ghar Beti Sewa" />
                <meta property="og:description" content="Read the terms governing your use of our property rental services in Nepal" />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={`${window.location.origin}/terms-of-service`} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <main className="legal-wrapper" itemScope itemType="https://schema.org/WebPage">
                <article>
                    <h1 itemProp="name">Terms of Service</h1>
                    <p itemProp="datePublished"><strong>Effective Date:</strong> January 30, 2025</p>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">1. Acceptance of Terms</h2>
                        <p itemProp="text">By accessing or using Ghar Beti Sewa ("Platform"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use our services.</p>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">2. Services Offered</h2>
                        <p itemProp="text">Ghar Beti Sewa provides an online platform that connects:</p>
                        <ul>
                            <li>Property owners/agents with potential tenants</li>
                            <li>Students with hostel accommodations</li>
                            <li>Users with verified rental properties throughout Nepal</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">3. User Eligibility</h2>
                        <p itemProp="text">To use our services, you must:</p>
                        <ul>
                            <li>Be at least 13 years of age</li>
                            <li>Have legal capacity to enter into contracts</li>
                            <li>Users under 18 require parental/guardian consent</li>
                            <li>Provide accurate and complete registration information</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">4. User Responsibilities</h2>
                        <p itemProp="text">All users agree to:</p>
                        <ul>
                            <li>Provide truthful and accurate information</li>
                            <li>Maintain the confidentiality of account credentials</li>
                            <li>Use the platform only for lawful purposes</li>
                            <li>Not engage in fraudulent activities</li>
                            <li>Comply with all applicable Nepalese laws</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">5. Prohibited Activities</h2>
                        <p itemProp="text">You may not:</p>
                        <ul>
                            <li>Post fake, misleading, or illegal listings</li>
                            <li>Harass, spam, or threaten other users</li>
                            <li>Attempt to bypass security measures</li>
                            <li>Use automated systems to access the platform</li>
                            <li>Violate intellectual property rights</li>
                            <li>Discriminate based on caste, ethnicity, gender, or religion</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">6. Content Ownership</h2>
                        <p itemProp="text">Users retain ownership of content they submit but grant Ghar Beti Sewa a worldwide, non-exclusive license to:</p>
                        <ul>
                            <li>Display, distribute, and promote the content</li>
                            <li>Make derivative works for platform functionality</li>
                            <li>Use content for marketing purposes</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">7. Account Termination</h2>
                        <p itemProp="text">We reserve the right to:</p>
                        <ul>
                            <li>Suspend or terminate accounts violating these terms</li>
                            <li>Remove inappropriate content without notice</li>
                            <li>Report illegal activities to authorities</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">8. Limitation of Liability</h2>
                        <p itemProp="text">Ghar Beti Sewa is not responsible for:</p>
                        <ul>
                            <li>User-generated content accuracy</li>
                            <li>Disputes between users</li>
                            <li>Damages from platform use</li>
                            <li>Service interruptions beyond our control</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">9. Modifications</h2>
                        <p itemProp="text">We may:</p>
                        <ul>
                            <li>Update these terms periodically</li>
                            <li>Notify users of significant changes via email or platform notifications</li>
                            <li>Require acceptance of new terms for continued service</li>
                        </ul>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">10. Governing Law</h2>
                        <p itemProp="text">These terms are governed by Nepalese law. Any disputes shall be resolved in the courts of Nepal.</p>
                    </section>

                    <section itemScope itemProp="hasPart" itemType="https://schema.org/WebPageElement">
                        <h2 itemProp="name">11. Contact Information</h2>
                        <address itemProp="address" itemType="https://schema.org/PostalAddress">
                            <p>For questions about these Terms:</p>
                            <p><strong>Email:</strong> <a href="mailto:paudelabinash58@gmail.com" itemProp="email">paudelabinash58@gmail.com</a></p>
                            <p><strong>Phone:</strong> <a href="tel:+9779766004113" itemProp="telephone">+977-9766004113</a></p>
                        </address>
                    </section>
                </article>
            </main>
        </>
    );
};

export default Terms;