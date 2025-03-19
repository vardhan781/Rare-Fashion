import React from "react";
import Hero from "../../components/Hero/Hero";
import SummerCollection from "../../components/SummerCollection/SummerCollection";
import DenimDreams from "../../components/DenimDreams/DenimDreams";
import NoworNever from "../../components/NoworNever/NoworNever";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page-main">
      <Hero />
      <SummerCollection />
      <DenimDreams />
      <NoworNever />
    </div>
  );
};

export default Home;
