import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, List, Package } from "lucide-react";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActive("add");
    else if (path === "/list") setActive("list");
    else if (path === "/orders") setActive("orders");
    else setActive("");
  }, [location.pathname]);

  const handleClick = (action, path) => {
    setActive(action);
    navigate(path);
  };

  return (
    <div className="sidebar-main">
      <div className="sidebar-buttons">
        <button
          onClick={() => handleClick("add", "/")}
          className={`sidebar-btn ${active === "add" ? "active" : ""}`}
          title="Add Product"
        >
          <Plus />
          <span>Add</span>
        </button>

        <button
          onClick={() => handleClick("list", "/list")}
          className={`sidebar-btn ${active === "list" ? "active" : ""}`}
          title="Product List"
        >
          <List />
          <span>List</span>
        </button>

        <button
          onClick={() => handleClick("orders", "/orders")}
          className={`sidebar-btn ${active === "orders" ? "active" : ""}`}
          title="Orders"
        >
          <Package />
          <span>Orders</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
