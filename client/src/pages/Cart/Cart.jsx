import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { ShopContext } from "../../Context/ShopContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    getCartAmount,
    token,
    totalAmount,
    deliveryCharge,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-products">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div key={index} className="single-cart-product">
              <div className="left-side-cart">
                <img src={productData.image} alt="" />
                <div className="cart-product-detail">
                  <p>{productData.name}</p>
                  <div className="other-cart-detail">
                    <p>
                      {currency} {productData.price}
                    </p>
                    <p className="cart-product-size">{item.size}</p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                type="number"
                min={1}
                defaultValue={item.quantity}
                name=""
                id=""
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="remove-product"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>
      <div className="cart-total-details">
        <div className="cart-total-head">
          <h1>Order Summary</h1>
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
              {deliveryCharge().toFixed(2)} {currency}
            </p>
          </div>
          <div className="amt">
            <p>
              <b>Total</b>
            </p>
            <p>
              <b>
                {totalAmount.toFixed(2)} {currency}
              </b>
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (getCartAmount() === 0) {
              navigate("/collection");
              toast.info("Cart is empty");
            } else if (!token) {
              navigate("/login");
            } else {
              navigate("/place-order");
            }
          }}
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
