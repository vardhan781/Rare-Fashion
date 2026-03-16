import { useState } from "react";
import { LogOut, X } from "lucide-react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = ({ setToken }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setToken("");
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="navbar-main">
        <div className="navbar-left">
          <img
            src={assets.logo}
            alt="Logo"
            className="navbar-logo"
            loading="lazy"
          />
        </div>
        <div className="navbar-middle">
          <h1 className="navbar-title">Admin Panel</h1>
        </div>
        <div className="navbar-right">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="navbar-logout-btn"
            aria-label="Log out from admin panel"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">
                Confirm Logout
              </h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p>Are you sure you want to log out of the admin panel?</p>
              <p className="modal-note">
                You'll need to log in again to access the dashboard.
              </p>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="modal-btn modal-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="modal-btn modal-btn-primary"
                autoFocus
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
