import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import "./Product.css";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";
import Loader from "../../components/Loader/Loader";
import {
  Star,
  Truck,
  Shield,
  RefreshCw,
  ShoppingCart,
  Award,
} from "lucide-react";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, productLoading } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(productData._id, selectedSize);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (productLoading || !productData) {
    return <Loader />;
  }

  return (
    <div className="product-container">
      {/* Product Main Display */}
      <div className="product-main">
        {/* Product Image */}
        <div className="product-img-container">
          <div className="product-main-img">
            <img src={productData.image} alt={productData.name} />
          </div>
        </div>

        {/* Product Information */}
        <div className="product-details-info">
          <div className="product-header-section">
            <div className="product-title-row">
              <h1 className="product-title-text">{productData.name}</h1>
              {productData.bestseller && (
                <div className="bestseller-tag-container">
                  <Award size={18} />
                  <span className="bestseller-text">Bestseller</span>
                </div>
              )}
            </div>
            <div className="product-category">
              <span className="category-badge">{productData.category}</span>
            </div>
          </div>

          <div className="product-rating-section">
            <div className="rating-stars">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={18} fill="#fbbf24" stroke="#fbbf24" />
              ))}
              <Star size={18} fill="#fbbf24" stroke="#fbbf24" />
              <span className="rating-count">(122 reviews)</span>
            </div>
          </div>

          <div className="product-price-section">
            <span className="price-currency">{currency}</span>
            <span className="price-amount">
              {productData.price.toLocaleString()}
            </span>
          </div>

          <div className="product-desc-text">
            <p>{productData.description}</p>
          </div>

          {/* Size Selection */}
          <div className="product-size-select">
            <h3 className="size-title-text">Select Size</h3>
            <div className="size-options-grid">
              {productData.sizes?.map((size, index) => (
                <button
                  key={index}
                  className={`size-option-btn ${selectedSize === size ? "size-selected" : ""}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="size-hint-text">Please select a size</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className={`add-cart-btn ${!selectedSize || isAddingToCart ? "btn-disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={!selectedSize || isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <div className="loading-spinner-small"></div>
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                Add to Cart
              </>
            )}
          </button>

          {/* Product Benefits */}
          <div className="product-benefits">
            <div className="benefit-item">
              <Truck size={20} />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders over $120</p>
              </div>
            </div>
            <div className="benefit-item">
              <Shield size={20} />
              <div>
                <h4>Authentic Products</h4>
                <p>100% Original</p>
              </div>
            </div>
            <div className="benefit-item">
              <RefreshCw size={20} />
              <div>
                <h4>Easy Returns</h4>
                <p>30-Day Return Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description Section */}
      <div className="product-description-section">
        <div className="description-card">
          <h2 className="section-title">Product Details</h2>
          <div className="description-content">
            {productData.details && productData.details.length > 0 ? (
              <ul className="details-items">
                {productData.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            ) : (
              <p>{productData.description}</p>
            )}
          </div>
        </div>

        <div className="features-card">
          <h2 className="section-title">Features</h2>
          <div className="features-list">
            <div className="feature-item-card">Premium Quality Material</div>
            <div className="feature-item-card">Perfect Fit Design</div>
            <div className="feature-item-card">Easy to Care For</div>
            <div className="feature-item-card">Comfortable Wear</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products-section">
        <h2 className="related-title">You Might Also Like</h2>
        <RelatedProducts
          category={productData.category}
          currentProductId={productData._id}
        />
      </div>
    </div>
  );
};

export default Product;
