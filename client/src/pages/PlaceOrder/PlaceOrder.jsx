import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { CreditCard, Wallet, Lock, Truck } from "lucide-react";

const PlaceOrder = () => {
  const {
    getCartAmount,
    currency,
    deliveryCharge,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    products,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + deliveryCharge(),
      };
      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } },
          );
          if (response.data.success) {
            setCartItems({});
            toast.success("Order placed successfully");
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } },
          );

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error("Error Occured in Stripe");
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <form onSubmit={onSubmitHandler} className="place-order-container">
      <div className="order-form-section">
        <div className="form-header">
          <h1 className="section-title">
            <Truck size={24} />
            Delivery Information
          </h1>
          <p className="section-subtitle">Please fill in your details</p>
        </div>

        <div className="form-inputs">
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={onChangeHandler}
                placeholder="Enter your first name"
                value={formData.firstName}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={onChangeHandler}
                value={formData.lastName}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={onChangeHandler}
              value={formData.email}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              onChange={onChangeHandler}
              value={formData.street}
              placeholder="Enter your street address"
              required
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                onChange={onChangeHandler}
                value={formData.city}
                placeholder="Enter your city"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                onChange={onChangeHandler}
                placeholder="Enter your state"
                value={formData.state}
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="zipcode">Zip Code</label>
              <input
                type="number"
                id="zipcode"
                name="zipcode"
                onChange={onChangeHandler}
                value={formData.zipcode}
                placeholder="Enter zip code"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                onChange={onChangeHandler}
                placeholder="Enter your country"
                value={formData.country}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="number"
              id="phone"
              name="phone"
              onChange={onChangeHandler}
              placeholder="Enter your phone number"
              value={formData.phone}
              required
            />
          </div>
        </div>
      </div>

      <div className="order-summary-section">
        <div className="summary-card">
          <div className="summary-header">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-icon">
              <img src={assets.bill} alt="Bill" />
            </div>
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                {currency}
                {getCartAmount().toLocaleString()}.00
              </span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>
                {currency}
                {deliveryCharge().toFixed(2)}
              </span>
            </div>
            <div className="summary-total">
              <span>Total Amount</span>
              <span className="total-amount">
                {currency}
                {(getCartAmount() + deliveryCharge()).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="payment-section">
            <h3 className="payment-title">Select Payment Method</h3>
            <div className="payment-options">
              <div
                className={`payment-option ${method === "cod" ? "selected" : ""}`}
                onClick={() => setMethod("cod")}
              >
                <div className="option-radio">
                  <div
                    className={`radio-dot ${method === "cod" ? "active" : ""}`}
                  ></div>
                </div>
                <div className="option-content">
                  <div className="option-icon">
                    <Wallet size={20} />
                  </div>
                  <div className="option-info">
                    <h4>Cash on Delivery</h4>
                    <p>Pay when you receive</p>
                  </div>
                </div>
              </div>

              <div
                className={`payment-option ${method === "stripe" ? "selected" : ""}`}
                onClick={() => setMethod("stripe")}
              >
                <div className="option-radio">
                  <div
                    className={`radio-dot ${method === "stripe" ? "active" : ""}`}
                  ></div>
                </div>
                <div className="option-content">
                  <div className="option-icon">
                    <CreditCard size={20} />
                  </div>
                  <div className="option-info">
                    <h4>Credit/Debit Card</h4>
                    <p>Secure payment via Stripe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="security-note">
            <Lock size={16} />
            <span>Your payment is secure and encrypted</span>
          </div>

          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
