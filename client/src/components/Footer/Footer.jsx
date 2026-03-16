import "./Footer.css";
import { assets } from "../../assets/assets";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-image">
          <img src={assets.shopping_bag} alt="Shopping bag" />
        </div>

        <div className="footer-content">
          <p className="footer-text">
            Sign up now & be the first to know about exclusive offers, latest
            fashion news & style tips!
          </p>

          <div className="footer-socials">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>

          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} Anjali Oza. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
