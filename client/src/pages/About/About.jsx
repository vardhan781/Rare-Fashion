import React from "react";
import { assets } from "../../assets/assets";
import "./About.css";

const About = () => {
  return (
    <div className="about-sec">
      <img src={assets.about} alt="" />
      <div className="about-sec-detail">
        <h1>About Us</h1>
        <span></span>
        <div className="about-para">
          <p>
            Welcome to <b>RARE FASHION</b>,
          </p>
          <p>where the spirit roams free and the heart beats wild.</p>
          <p>
            Inspired by the wild beauty of the Rare Fashion, we celebrate
            diversity, individuality, and endless possibilities.
          </p>
          <p>
            We're more than just a clothing line; we're a sanctuary for the
            daring, the dreamers, and the fiercely independent souls.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
