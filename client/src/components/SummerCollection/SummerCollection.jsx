import React from "react";
import "./SummerCollection.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SummerCollection = () => {
  const navigate = useNavigate();
  return (
    <div className="summer">
      <h1>Summer Collection</h1>
      <div className="ads">
        <img src={assets.pro5} alt="" />
        <img src={assets.pro3} alt="" />
        <img src={assets.pro1} alt="" />
        <div className="ad-path">
          <img src={assets.right_arrow} alt="" />
          <button onClick={() => navigate("/collection")} className="pink">
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummerCollection;
