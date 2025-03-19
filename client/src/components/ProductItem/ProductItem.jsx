import React, { useContext } from "react";
import "./ProductItem.css";
import { ShopContext } from "../../Context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

export const ProductItem = ({ id, name, price, bestseller, image }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link className="display-product" to={`/product/${id}`}>
      <div className="display-section">
        <img src={image} alt="" />
      </div>
      <div className="product-item-other-info">
        <p className="product-name">{name}</p>
        <div className="selling-usp">
          <p className="product-price">
            {currency}
            {price}
          </p>
          {bestseller && <img src={assets.bestseller} alt="" />}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
