import React, { useContext } from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer">
      <img src={assets.shopping_bag} alt="" />
      <div className="remind">
        <p>
          Sign up now & be the first to know about exclusive offers, Latest{" "}
          <br />
          fashion news & style tips!{" "}
        </p>
        <div className="socials">
          <img src={assets.twitter} alt="" />
          <img src={assets.facebook} alt="" />
          <img src={assets.instagram} alt="" />
        </div>
        <div className="copyright">
          <p>©2025 Rare Fashion , All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
