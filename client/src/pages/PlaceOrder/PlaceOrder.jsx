import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
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
            { headers: { token } }
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
            { headers: { token } }
          );

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error("Error Occured in Stripe");
          }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="place-page">
      <div className="place-order-details">
        <h1>Delivery Information</h1>
        <div className="place-inputs">
          <div className="place-double">
            <input
              type="text"
              name="firstName"
              onChange={onChangeHandler}
              placeholder="First Name"
              value={formData.firstName}
              required
            />
            <input
              type="text"
              name="lastName"
              onChange={onChangeHandler}
              value={formData.lastName}
              placeholder="Last Name"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={formData.email}
            placeholder="Email address"
            required
          />
          <input
            type="text"
            name="street"
            onChange={onChangeHandler}
            value={formData.street}
            placeholder="Street"
            required
          />
          <div className="place-double">
            <input
              type="text"
              name="city"
              onChange={onChangeHandler}
              value={formData.city}
              placeholder="City"
              required
            />
            <input
              type="text"
              name="state"
              onChange={onChangeHandler}
              placeholder="State"
              value={formData.state}
              required
            />
          </div>
          <div className="place-double">
            <input
              type="number"
              name="zipcode"
              onChange={onChangeHandler}
              value={formData.zipcode}
              placeholder="Zip Code"
              required
            />
            <input
              type="text"
              name="country"
              onChange={onChangeHandler}
              placeholder="Country"
              value={formData.country}
              required
            />
          </div>
          <input
            type="number"
            name="phone"
            onChange={onChangeHandler}
            placeholder="Number"
            value={formData.phone}
            required
          />
        </div>
      </div>
      <div className="place-total-details">
        <div className="cart-total-head">
          <h1>
            <b>Order Summary</b>
          </h1>
          <img src={assets.bill} alt="" />
        </div>
        <div className="cart-amount-detail">
          <div className="amt">
            <p>Subtotal</p>
            <p>
              {getCartAmount()}.00 {currency}
            </p>
          </div>
          <div className="amt">
            <p>Delivery Charges</p>
            <p>
              {deliveryCharge()}.00 {currency}
            </p>
          </div>
          <div className="amt">
            <p>
              <b>Total</b>
            </p>
            <p>
              <b>
                {(getCartAmount() + deliveryCharge()).toFixed(2)} {currency}
              </b>
            </p>
          </div>
        </div>
        <div className="payment-option-buttons">
          <div onClick={() => setMethod("cod")} className="single-option">
            <p
              className={`option-selection ${
                method === "cod" ? "option-payment-selected" : ""
              }`}
            ></p>
            <img src={assets.cod} alt="" />
            <p className="name-of-option">COD</p>
          </div>
          <div onClick={() => setMethod("stripe")} className="single-option">
            <p
              className={`option-selection ${
                method === "stripe" ? "option-payment-selected" : ""
              }`}
            ></p>
            <img src={assets.stripe} alt="" />
            <p className="name-of-option">Stripe</p>
          </div>
        </div>
        <button type="submit">Place Order</button>
      </div>
    </form>
  );
};

export default PlaceOrder;
