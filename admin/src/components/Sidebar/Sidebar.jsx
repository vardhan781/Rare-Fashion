import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("");
  return (
    <div className="sidebar-main-content">
      <div className="sidebar-buttons">
        <button
          onClick={() => {
            setAction("add");
            navigate("/add");
          }}
          className={`sidebar-action-button ${
            action === "add" ? "selected-action-button" : ""
          }`}
        >
          <img src={assets.add} alt="" />
          <p>Add</p>
        </button>
        <button
          onClick={() => {
            setAction("list");
            navigate("/list");
          }}
          className={`sidebar-action-button ${
            action === "list" ? "selected-action-button" : ""
          }`}
        >
          <img src={assets.list} alt="" />
          <p>List</p>
        </button>
        <button
          onClick={() => {
            setAction("orders");
            navigate("/orders");
          }}
          className={`sidebar-action-button ${
            action === "orders" ? "selected-action-button" : ""
          }`}
        >
          <img src={assets.order} alt="" />
          <p>Orders</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
