import React from "react";
import "./NoworNever.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const NoworNever = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    window.scrollTo(0, 0);
    navigate("/collection");
  };

  return (
    <div className="now">
      <h1>Now Or Never</h1>
      <div className="cover">
        <img src={assets.header3} alt="" />
        <button onClick={handleShopNow}>Shop Now!</button>
      </div>
    </div>
  );
};

export default NoworNever;
