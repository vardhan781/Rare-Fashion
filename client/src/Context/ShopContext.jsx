import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const delivery_fee = 10;
  const currency = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [category, setCategory] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [productLoading, setProductLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select The Size");

      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};

      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    toast.success("Product added");

    if (token) {
      try {
        setAddToCartLoading(true);
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error);
      } finally {
        setAddToCartLoading(false);
      }
    }
  };

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }

    return totalAmount;
  };

  const getProductData = async () => {
    try {
      setProductLoading(true);
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setProductLoading(false);
    }
  };

  const getUserCart = async (token) => {
    try {
      setCartLoading(true);
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  const deliveryCharge = () => {
    return getCartAmount() < 120 && getCartAmount() > 0 ? delivery_fee : 0;
  };

  const totalAmount = getCartAmount() + deliveryCharge();

  const value = {
    delivery_fee,
    products,
    currency,
    category,
    setCategory,
    toggleCategory,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartAmount,
    backendUrl,
    setToken,
    token,
    deliveryCharge,
    totalAmount,
    productLoading,
    cartLoading,
    addToCartLoading,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
