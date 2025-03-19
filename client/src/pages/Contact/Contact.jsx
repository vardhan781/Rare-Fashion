import React from "react";
import "./Contact.css";
import { assets } from "../../assets/assets";

const Contact = () => {
  return (
    <div className="contact-page">
      <h1>
        HOW TO CONTACT <br /> RARE FASHION{" "}
      </h1>
      <h3>CHOOSE YOUR PREFERRED METHOD OF CONTACT AND CONNECT WITH US</h3>
      <div className="contact-detail">
        <div className="contact-method">
          <h2>
            <b>APPLE MESSAGE</b>
          </h2>
          <p>
            Monday-Saturday from 9AM to 8PM (EST). <br />
            Sunday from 10AM to 7PM(EST).
          </p>
          <div className="contact-link">
            <img src={assets.apple_logo} alt="" />
            <a>Message Us</a>
          </div>
        </div>
        <div className="contact-method">
          <h2>
            <b>PHONE</b>
          </h2>
          <p>
            Monday-Saturday from 9AM to 11PM (EST). <br />
            Sunday from 10AM to 9PM(EST).
          </p>
          <div className="contact-link">
            <img src={assets.phone} alt="" />
            <a>Call Us +91-972 531 2744</a>
          </div>
        </div>
        <div className="contact-method">
          <h2>
            <b>EMAIL</b>
          </h2>
          <p>Your inquiry will recive a response from a Client Advisor</p>
          <div className="contact-link">
            <img src={assets.email_contact} alt="" />
            <a>Write Us</a>
          </div>
        </div>
        <div className="contact-method">
          <h2>
            <b>WHATSAPP</b>
          </h2>
          <p>
            Monday-Saturday from 9AM to 8PM (EST). <br />
            Sunday from 10AM to 7 PM(EST).
          </p>
          <div className="contact-link">
            <img src={assets.whatsapp} alt="" />
            <a>WhatsApp Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
