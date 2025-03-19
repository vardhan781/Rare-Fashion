import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Login from "./components/Login/Login";
import { ToastContainer } from "react-toastify";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <>
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
      />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div>
          <Navbar setToken={setToken} />
          <div className="app-main-content">
            <div className="app-left-side">
              <Sidebar />
            </div>
            <div className="app-right-side">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
