import React from "react";
import "./Orders.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);
  return (
    <div className="admin-all-order">
      {orders.map((order, index) => (
        <div key={index} className="user-individual-order">
          <div className="order-individual-first-sec">
            <img className="order-log-image" src={assets.delivery} alt="" />
            <div className="order-log-name">
              {order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return (
                    <div className="order-log-with-size">
                      <p key={index}>
                        {item.name} x {item.quantity}
                      </p>
                      <p className="order-log-size"> {item.size}</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="order-log-with-size">
                      <p key={index}>
                        {item.name} x {item.quantity}
                      </p>
                      <p className="order-log-size"> {item.size} </p>
                    </div>
                  );
                }
              })}
            </div>
            <div className="order-log-others">
              <p>{order.address.firstName + " " + order.address.lastName}</p>
              <p>
                {order.address.street +
                  ", " +
                  order.address.city +
                  ", " +
                  order.address.country +
                  ", " +
                  order.address.zipcode}
              </p>
              <p>{order.address.phone}</p>
            </div>
          </div>
          <div className="order-individual-second-sec">
            <p>Items: {order.items.length}</p>
            <p>Method: {order.paymentMethod}</p>
            <p>Payment: {order.payment ? "Done" : "Pending"}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <div className="order-log-price-tag">
              <p>$ {order.amount}</p>
            </div>
          </div>

          <div className="order-individual-third-sec">
            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
