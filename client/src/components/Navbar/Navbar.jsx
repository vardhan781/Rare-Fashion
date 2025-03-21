import React, { useContext, useState } from "react";
import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../Context/ShopContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { getCartAmount, token, setToken, setCartItems } =
    useContext(ShopContext);

  const [dropdown, setDropdown] = useState(false);
  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };
  const drop = () => {
    setDropdown(!dropdown);
  };

  const loginPath = () => {
    navigate("/login");
  };

  const toggle = () => {
    setVisible(!visible);
  };

  const homePath = () => {
    navigate("/");
  };
  const collectionPath = () => {
    navigate("/collection");
  };
  const aboutPath = () => {
    navigate("/about");
  };
  const contactPath = () => {
    navigate("/contact");
  };
  const cartPath = () => {
    navigate("/cart");
  };

  return (
    <>
      <nav className="main">
        <div className="contents">
          <div className="left">
            <img src={assets.logo} alt="" />
          </div>
          <div className="links">
            <ul>
              <li onClick={homePath}>home</li>
              <li onClick={aboutPath}>about</li>
              <li onClick={collectionPath}>collection</li>
              <li onClick={contactPath}>contact</li>
            </ul>
          </div>
          <div className="right">
            {token ? (
              <div className="login-placeholder"></div>
            ) : (
              <button onClick={loginPath}>Login</button>
            )}

            <div className="cart-icon">
              <img onClick={cartPath} src={assets.shopping_cart} alt="" />
              {getCartAmount() === 0 ? "" : <span></span>}
            </div>
            <div className="user-icon-state">
              <img onClick={drop} src={assets.user} alt="" />
              {/* Dropdown box */}
              {dropdown ? (
                <div className="drop-menu">
                  <ul>
                    <li
                      onClick={() => {
                        if (localStorage.getItem("token")) {
                          navigate("orders");
                          setDropdown(false);
                        } else {
                          toast.info("You are not logged in");
                          setDropdown(false);
                        }
                      }}
                    >
                      Orders
                    </li>
                    <li
                      onClick={() => {
                        if (localStorage.getItem("token")) {
                          logOut();
                          setDropdown(false);
                        } else {
                          toast.info("You are not logged in");
                          setDropdown(false);
                        }
                      }}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>

            <img
              className="side-icon"
              onClick={toggle}
              src={assets.sidebar}
              alt=""
            />
          </div>
        </div>
      </nav>

      {/* Downbar for Small Screen */}

      {!visible ? (
        " "
      ) : (
        <ul className="sidebar">
          <li
            onClick={() => {
              setVisible(false);
              homePath();
            }}
          >
            home
          </li>
          <li
            onClick={() => {
              setVisible(false);
              cartPath();
            }}
          >
            cart
          </li>
          <li
            onClick={() => {
              setVisible(false);
              collectionPath();
            }}
          >
            collection
          </li>
          <li
            onClick={() => {
              setVisible(false);
              contactPath();
            }}
          >
            contact
          </li>
          <li
            onClick={() => {
              setVisible(false);
              aboutPath();
            }}
          >
            about
          </li>
        </ul>
      )}
    </>
  );
};

export default Navbar;
