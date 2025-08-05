import React from 'react';
import { Helmet } from 'react-helmet';
import './Programs.css';
import program_1 from '../assets/edusity_assets/program-1.png';
import program_2 from '../assets/edusity_assets/program-2.jpg';
import program_3 from '../assets/edusity_assets/program-3.jpg';

const Programs = () => {
    const programData = [
        {
            id: 1,
            image: program_3,
            alt: "Luxury home with modern architecture in Nepal",
            title: "Beautiful Houses",
            description: "Discover our curated selection of premium properties across Nepal"
        },
        {
            id: 2,
            image: program_2,
            alt: "Map showing property locations throughout Nepal",
            title: "Nationwide Coverage",
            description: "Find properties in any region of Nepal with our extensive network"
        },
        {
            id: 3,
            image: program_1,
            alt: "Digital verification process for property listings",
            title: "Easy Verification",
            description: "Streamlined process for listing and verifying your property"
        }
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": programData.map((program, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Service",
                "name": program.title,
                "description": program.description,
                "image": program.image
            }
        }))
    };

    return (
        <>
            <Helmet>
                <meta name="description" content="Explore our comprehensive property services including verified listings, nationwide coverage, and beautiful homes across Nepal." />
                <meta property="og:title" content="Our Property Services | Nepal's Trusted Real Estate Platform" />
                <meta property="og:description" content="Discover beautiful homes, nationwide property coverage, and easy verification services for buyers and sellers in Nepal." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={program_1} />
                <meta property="og:image:alt" content="Property verification service in Nepal" />
                <link rel="canonical" href={`${window.location.origin}/services`} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <section className="programs" aria-label="Our property services">
                {programData.map((program) => (
                    <article key={program.id} className="program" itemScope itemType="https://schema.org/Service">
                        <figure>
                            <img
                                src={program.image}
                                alt={program.alt}
                                loading="lazy"
                                itemProp="image"
                                width="400"
                                height="300"
                            />
                            <figcaption className="caption" itemProp="name">
                                <p>{program.title}</p>
                                <span className="sr-only">{program.description}</span>
                            </figcaption>
                        </figure>
                        <div className="program-description" itemProp="description">
                        </div>
                    </article>
                ))}
            </section>
        </>
    );
};

export default Programs;