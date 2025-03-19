import React, { useEffect, useState } from "react";
import "./List.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const fetchlist = async () => {
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
    }
  };
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
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
    }
  };
  useEffect(() => {
    fetchlist();
  }, []);

  return (
    <div className="list-added-products">
      <div className="heading-of-list">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Action</b>
      </div>

      {list.map((item, index) => (
        <div className="products-show-list">
          <div className="product-show-individual" key={index}>
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
