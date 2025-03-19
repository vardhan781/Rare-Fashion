import React from "react";
import { assets } from "../../assets/assets";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-img">
        <img className="w-300" src={assets.header1} alt="" />
      </div>
      <h3>
        Explore <br />
        The <br /> Anjali Meddy
      </h3>
      <h2>Summer is here</h2>
    </div>
  );
};

export default Hero;
