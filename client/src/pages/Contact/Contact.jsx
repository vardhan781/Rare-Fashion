import React from "react";
import "./Contact.css";
import { FaApple, FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-page">
      <h1>
        HOW TO CONTACT <br /> RARE FASHION
      </h1>
      <h3>CHOOSE YOUR PREFERRED METHOD OF CONTACT AND CONNECT WITH US</h3>

      <div className="contact-detail">
        <div className="contact-method">
          <h2>APPLE MESSAGE</h2>
          <p>
            Monday–Saturday from 9AM to 8PM (EST). <br />
            Sunday from 10AM to 7PM (EST).
          </p>
          <div className="contact-link">
            <FaApple size={22} />
            <a>Message Us</a>
          </div>
        </div>

        <div className="contact-method">
          <h2>PHONE</h2>
          <p>
            Monday–Saturday from 9AM to 11PM (EST). <br />
            Sunday from 10AM to 9PM (EST).
          </p>
          <div className="contact-link">
            <FaPhoneAlt size={20} />
            <a>Call Us +91-972 531 2744</a>
          </div>
        </div>

        <div className="contact-method">
          <h2>EMAIL</h2>
          <p>Your inquiry will receive a response from a Client Advisor</p>
          <div className="contact-link">
            <FaEnvelope size={20} />
            <a>Write Us</a>
          </div>
        </div>

        <div className="contact-method">
          <h2>WHATSAPP</h2>
          <p>
            Monday–Saturday from 9AM to 8PM (EST). <br />
            Sunday from 10AM to 7PM (EST).
          </p>
          <div className="contact-link">
            <FaWhatsapp size={22} />
            <a>WhatsApp Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
