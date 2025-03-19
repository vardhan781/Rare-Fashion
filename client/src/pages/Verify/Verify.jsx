import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const navigate = useNavigate();
  const { token, backendUrl, setCartItems } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const userId = searchParams.get("userId");

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        { userId, orderId },
        { headers: { token }, params: { success } }
      );
      if (response.data.success) {
        setCartItems({});
        toast.success("Order placed successfully");
        navigate("/orders");
      } else {
        navigate("/cart");
        toast.error("Payment was interrupted");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    verifyPayment();
  }, [token]);
  return;
  <div></div>;
};

export default Verify;
