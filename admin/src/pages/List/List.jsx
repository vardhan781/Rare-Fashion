import React, { useEffect, useState } from "react";
import "./List.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { backendUrl } from "../../App";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchlist();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchlist();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="list-added-products">
      <div className="heading-of-list">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Action</b>
      </div>

      {list.map((item) => (
        <div className="products-show-list" key={item._id}>
          <div className="product-show-individual">
            <img className="ind-image-show" src={item.image} alt="" />
            <p className="ind-name-show">{item.name}</p>
            <p className="ind-category-show">{item.category}</p>
            <p className="ind-price-show-">$ {item.price}</p>
            <img
              className="ind-action-button"
              src={assets.remove}
              onClick={() => removeProduct(item._id)}
              alt=""
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
