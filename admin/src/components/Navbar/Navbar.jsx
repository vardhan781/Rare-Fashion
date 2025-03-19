import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="navbar-main">
      <div className="navbar-left">
        <img src={assets.logo} alt="" />
      </div>
      <div className="navbar-middle">
        <h2>Admin Panel</h2>
      </div>
      <div className="navbar-right">
        <button onClick={() => setToken("")}>Log Out</button>
      </div>
    </div>
  );
};

export default Navbar;
