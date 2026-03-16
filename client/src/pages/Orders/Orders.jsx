import React, { useContext, useEffect, useState } from "react";
import "./Orders.css";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import { RefreshCw } from "lucide-react";

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      setRefreshing(true);

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadOrderData();
  };

  useEffect(() => {
    setLoading(true);
    loadOrderData();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">My Orders</h1>
        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={18} className={refreshing ? "spinning" : ""} />
          Refresh
        </button>
      </div>

      {orderData.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">
            <div className="icon-circle">📦</div>
          </div>
          <h2>No orders yet</h2>
          <p>Your orders will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orderData.map((item, index) => (
            <div className="order-item" key={index}>
              <div className="order-item-main">
                <div className="order-image-box">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="order-details-box">
                  <h3 className="product-title">{item.name}</h3>

                  <div className="order-info-row">
                    <div className="info-group">
                      <span className="info-label">Price:</span>
                      <span className="info-value">
                        {currency} {item.price}
                      </span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Qty:</span>
                      <span className="info-value">{item.quantity}</span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Size:</span>
                      <span className="info-value size-tag">{item.size}</span>
                    </div>
                  </div>

                  <div className="order-meta">
                    <div className="meta-item">
                      <span className="meta-label">Ordered:</span>
                      <span className="meta-text">
                        {new Date(item.date).toDateString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Payment:</span>
                      <span className="meta-text">{item.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-status-section">
                <div className="status-indicator">
                  <div
                    className={`status-dot status-${item.status.toLowerCase().replace(/\s+/g, "-")}`}
                  ></div>
                  <span className="status-text">{item.status}</span>
                </div>
              </div>

              <div className="order-actions">
                <button
                  className="track-button"
                  onClick={() => loadOrderData()}
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
