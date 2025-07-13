import React from 'react';
import './Footer.css';
import { FiExternalLink } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className="footer-container">
        <p className="copyright">© {new Date().getFullYear()} Edusity. All rights reserved.</p>

        <ul className="footer-links">
          <li>
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service <FiExternalLink className="external-icon" />
            </a>
          </li>
          <li>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy <FiExternalLink className="external-icon" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;