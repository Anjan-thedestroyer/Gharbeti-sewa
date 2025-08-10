import React from 'react';
import './Footer.css';
import { FiExternalLink } from 'react-icons/fi';
import { Helmet } from 'react-helmet';

const Footer = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Gharbeti sewa",
              "url": "https://www.gharbeti-sewa.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.gharbeti-sewa.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      </Helmet>

      <footer className='footer' itemScope itemType="https://schema.org/WPFooter">
        <div className="footer-container">
          <p className="copyright" itemProp="copyrightYear">
            © {new Date().getFullYear()} <span itemProp="copyrightHolder">Edusity</span>. All rights reserved.
          </p>

          <ul className="footer-links">
            <li itemProp="significantLink">
              <a href="/terms" target="_blank" rel="noopener noreferrer" itemProp="url">
                Terms of Service <FiExternalLink className="external-icon" />
              </a>
            </li>
            <li itemProp="significantLink">
              <a href="/privacy" target="_blank" rel="noopener noreferrer" itemProp="url">
                Privacy Policy <FiExternalLink className="external-icon" />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;