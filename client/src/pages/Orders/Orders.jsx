import React, { useContext, useEffect, useState } from "react";
import "./Orders.css";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";
import Loader from "../../components/Loader/Loader";

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      setLoading(true);

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
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="order-page-main">
      <h1>Orders</h1>
      <div className="all-orders-sec">
        {orderData.map((item, index) => (
          <div className="individual-order-detail" key={index}>
            <div className="order-map-first-sec">
              <div className="order-image">
                <img src={item.image} alt="" />
              </div>
              <div className="order-other-detail">
                <h3>{item.name}</h3>
                <div className="order-other-second-line">
                  <p>
                    {currency} {item.price}{" "}
                  </p>
                  <p>Quantity: {item.quantity} </p>
                  <p>Size: {item.size} </p>
                </div>
                <p>Date: {new Date(item.date).toDateString()} </p>
                <p>Payment: {item.paymentMethod}</p>
              </div>
            </div>
            <div className="order-map-second-sec">
              <p className="order-status-color"></p>
              <p className="order-status-name">{item.status}</p>
            </div>
            <div className="order-map-third-sec">
              <button onClick={loadOrderData}>Track Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
