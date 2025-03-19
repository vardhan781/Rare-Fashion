import React from "react";
import "./DenimDreams.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const DenimDreams = () => {
  const navigate = useNavigate();

  return (
    <div className="denim">
      <h1>Denim Dreams</h1>
      <div className="ads">
        <img src={assets.pro_denim4} alt="" />
        <img src={assets.pro_denim2} alt="" />
        <img src={assets.pro_denim3} alt="" />
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

export default DenimDreams;
