import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { backendUrl } from "../../App";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import {
  Truck,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Package,
  User,
  CreditCard,
  ChevronDown,
  X,
} from "lucide-react";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const statusOptions = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (orderId, status) => {
    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status },
        { headers: { token } },
      );

      if (response.data.success) {
        await fetchAllOrders();
        setOpenDropdown(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) return <Loader />;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <p>Track and update order status ({orders.length} orders)</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <Package size={48} />
          <h3>No orders yet</h3>
          <p>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div className="order-id">
                  <Truck size={18} />
                  <span>Order #{order._id.slice(-6)}</span>
                </div>
                <div className="order-date">
                  <Calendar size={16} />
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="customer-info">
                <div className="customer-name">
                  <User size={16} />
                  <span>
                    {order.address.firstName} {order.address.lastName}
                  </span>
                </div>
                <div className="customer-phone">
                  <Phone size={16} />
                  <span>{order.address.phone}</span>
                </div>
              </div>

              <div className="order-address">
                <MapPin size={16} />
                <div>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.country} -{" "}
                    {order.address.zipcode}
                  </p>
                </div>
              </div>

              <div className="order-items">
                <h4>Items ({order.items.length})</h4>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div className="order-item" key={index}>
                      <span className="item-name">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="item-size">Size: {item.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <CreditCard size={16} />
                  <div>
                    <span className="detail-label">Payment</span>
                    <span
                      className={`detail-value ${order.payment ? "success" : "pending"}`}
                    >
                      {order.payment ? "Done" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Package size={16} />
                  <div>
                    <span className="detail-label">Method</span>
                    <span className="detail-value">{order.paymentMethod}</span>
                  </div>
                </div>
                <div className="detail-item price">
                  <DollarSign size={16} />
                  <div>
                    <span className="detail-label">Amount</span>
                    <span className="detail-value">${order.amount}</span>
                  </div>
                </div>
              </div>

              <div className="status-section">
                <div className="custom-dropdown">
                  <div
                    className="dropdown-header"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === order._id ? null : order._id,
                      )
                    }
                  >
                    <span
                      className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {order.status}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`dropdown-icon ${openDropdown === order._id ? "open" : ""}`}
                    />
                  </div>

                  {openDropdown === order._id && (
                    <div className="dropdown-options hide-scrollbar">
                      {statusOptions.map((status) => (
                        <div
                          key={status}
                          className={`option ${order.status === status ? "selected" : ""}`}
                          onClick={() => statusHandler(order._id, status)}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
