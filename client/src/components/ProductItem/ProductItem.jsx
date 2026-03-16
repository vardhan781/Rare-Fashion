import React, { useContext } from "react";
import "./ProductItem.css";
import { ShopContext } from "../../Context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

export const ProductItem = ({ id, name, price, bestseller, image }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="product-card" to={`/product/${id}`}>
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" loading="lazy" />
        {bestseller && (
          <div className="bestseller-badge">
            <img src={assets.bestseller} alt="Bestseller" />
          </div>
        )}
        <div className="quick-view">
          <span>View Product</span>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="price-section">
          <p className="product-price">
            <span className="currency">{currency}</span>
            <span className="amount">{price.toLocaleString()}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
