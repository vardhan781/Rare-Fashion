import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import "./Product.css";
import { assets } from "../../assets/assets";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <>
      <div className="product-display">
        {/* image of product */}
        {productData.image && (
          <img src={productData.image} alt={productData.name} />
        )}
        {/* Information */}
        <div className="product-info">
          <h1>{productData.name}</h1>
          <div className="star-rating">
            <img src={assets.star} alt="" />
            <img src={assets.star} alt="" />
            <img src={assets.star} alt="" />
            <img src={assets.star} alt="" />
            <p> (122) </p>
          </div>
          <p className="pro-price">
            {currency} {productData.price}
          </p>
          <p className="product-desc">{productData.description}</p>
          <div className="product-sizes">
            {productData.sizes.map((item, index) => (
              <button
                onClick={() => setSize(item)}
                className={`size-op ${item === size ? "selected-size" : ""}`}
                key={index}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="add-product"
          >
            Add
          </button>
        </div>
      </div>

      <button className="desc-for-small">Description :</button>

      <div className="small-desc">
        <p> {productData.description} </p>
      </div>
      <div className="policy-tags">
        <p>100% Original Product.</p>
        <p>Cash on delivery available.</p>
        <p>Easy return & exchange policy.</p>
      </div>

      {/* Related Products */}
      <div className="related-products">
        <RelatedProducts category={productData.category} />
      </div>
    </>
  ) : (
    <div></div>
  );
};

export default Product;
