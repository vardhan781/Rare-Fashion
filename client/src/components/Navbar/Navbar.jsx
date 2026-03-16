import { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  AlertCircle,
} from "lucide-react";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, token, setToken, setCartItems } = useContext(ShopContext);

  const getCartItemCount = () => {
    if (!cartItems || typeof cartItems !== "object") return 0;

    let itemCount = 0;

    for (const itemId in cartItems) {
      if (cartItems[itemId]) {
        const hasItems = Object.values(cartItems[itemId]).some(
          (qty) => qty > 0,
        );
        if (hasItems) {
          itemCount++;
        }
      }
    }

    return itemCount;
  };

  const cartItemCount = getCartItemCount();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveLink("home");
    else if (path === "/about") setActiveLink("about");
    else if (path === "/collection") setActiveLink("collection");
    else if (path === "/contact") setActiveLink("contact");
    else if (path === "/cart") setActiveLink("cart");
    else if (path === "/orders") setActiveLink("orders");
    else setActiveLink("");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setShowLogoutModal(false);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleOrdersClick = () => {
    if (token) {
      navigate("/orders");
      setIsDropdownOpen(false);
    } else {
      toast.error("Please login to view orders");
      setIsDropdownOpen(false);
    }
  };

  const navLinks = [
    { label: "home", path: "/" },
    { label: "collection", path: "/collection" },
    { label: "about", path: "/about" },
    { label: "contact", path: "/contact" },
  ];

  const sidebarLinks = [...navLinks, { label: "cart", path: "/cart" }];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".navbar-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <img
              src={assets.logo}
              alt="Brand Logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="navbar-links">
            <ul>
              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className={activeLink === link.label ? "active" : ""}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="navbar-right">
            {!token ? (
              <button
                className="navbar-login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <div className="navbar-login-placeholder"></div>
            )}

            <div className="navbar-icons">
              <div className="navbar-cart">
                <button
                  className="navbar-icon"
                  onClick={() => navigate("/cart")}
                  aria-label="Cart"
                >
                  <ShoppingCart size={22} />
                </button>
                {cartItemCount > 0 && (
                  <span className="navbar-cart-badge">
                    {cartItemCount > 10 ? "10+" : cartItemCount}
                  </span>
                )}
              </div>

              {token && (
                <div className="navbar-dropdown">
                  <button
                    className="navbar-icon"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="User menu"
                    aria-expanded={isDropdownOpen}
                  >
                    <User size={22} />
                  </button>

                  {isDropdownOpen && (
                    <div className="navbar-dropdown-menu">
                      <ul>
                        <li>
                          <button
                            className="navbar-dropdown-item"
                            onClick={handleOrdersClick}
                          >
                            <Package size={18} />
                            <span>Orders</span>
                          </button>
                        </li>
                        <li>
                          <button
                            className="navbar-dropdown-item"
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setShowLogoutModal(true);
                            }}
                          >
                            <LogOut size={18} />
                            <span>Logout</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <button
                className="navbar-menu-btn"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`navbar-sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="navbar-sidebar-header">
          <button
            className="navbar-sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="navbar-sidebar-links">
          <ul>
            {sidebarLinks.map((link) => (
              <li
                key={link.label}
                className={activeLink === link.label ? "active" : ""}
                onClick={() => navigateTo(link.path)}
              >
                {link.label}
              </li>
            ))}

            {token && (
              <>
                <li
                  className={activeLink === "orders" ? "active" : ""}
                  onClick={() => {
                    if (token) {
                      navigateTo("/orders");
                    } else {
                      toast.error("Please login to view orders");
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  Orders
                </li>
                <li onClick={() => setShowLogoutModal(true)}>Logout</li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-sidebar-footer">
          {!token && (
            <button
              className="navbar-login-btn"
              onClick={() => navigateTo("/login")}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div
          className="navbar-modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div className="navbar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="navbar-modal-icon">
              <AlertCircle size={48} color="var(--primary-pink)" />
            </div>
            <h3 className="navbar-modal-title">Confirm Logout</h3>
            <p className="navbar-modal-message">
              Are you sure you want to logout? You'll need to login again to
              access your account.
            </p>
            <div className="navbar-modal-actions">
              <button
                className="navbar-modal-btn cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="navbar-modal-btn confirm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
