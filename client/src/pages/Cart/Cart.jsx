import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { ShopContext } from "../../Context/ShopContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

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
    productLoading,
    cartLoading,
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

  const handleQuantityChange = (id, size, newQuantity) => {
    if (newQuantity < 1) {
      updateQuantity(id, size, 0);
    } else {
      updateQuantity(id, size, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    if (getCartAmount() === 0) {
      navigate("/collection");
      toast.info("Your cart is empty");
    } else if (!token) {
      navigate("/login");
    } else {
      navigate("/place-order");
    }
  };

  if (productLoading || cartLoading) {
    return <Loader />;
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <p className="cart-subtitle">{cartData.length} items in cart</p>
      </div>

      {cartData.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={64} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <button
            className="shop-now-btn"
            onClick={() => navigate("/collection")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items-section">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id,
              );
              return (
                <div key={index} className="cart-item-card">
                  <div className="cart-item-image">
                    <img src={productData.image} alt={productData.name} />
                  </div>

                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{productData.name}</h3>
                    <div className="cart-item-meta">
                      <div className="cart-item-size">
                        <span className="size-label">Size:</span>
                        <span className="size-value">{item.size}</span>
                      </div>
                      <div className="cart-item-price">
                        {currency}
                        {productData.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item._id,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        className="remove-item-btn"
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                        <span className="remove-text">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary-section">
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
                    {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={handleProceedToCheckout}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>

              <div className="continue-shopping">
                <button
                  className="continue-btn"
                  onClick={() => navigate("/collection")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
