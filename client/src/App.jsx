import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Collection from "./pages/Collection/Collection";
import Product from "./pages/Product/Product";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./pages/Cart/Cart";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Orders from "./pages/Orders/Orders";
import OtpVerify from "./pages/OtpVerify/OtpVerify";
import Verify from "./pages/Verify/Verify";

const App = () => {
  return (
    <div>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={true}
        autoClose={3000}
        newestOnTop={true}
        style={{
          backgroundColor: "transparent",
          boxShadow: "none",
          color: "inherit",
          fontSize: "14px",
          padding: "0",
          margin: "8px",
          maxWidth: "200px",
          textAlign: "left",
          borderRadius: "10px",
        }}
        className="custom-toast-container"
      />

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
