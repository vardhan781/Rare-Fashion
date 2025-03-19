import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { ProductItem } from "../ProductItem/ProductItem";
import "./RelatedProducts.css";

const RelatedProducts = ({ category }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);

      setRelated(productsCopy.slice(0, 4));
    }
  }, [products]);
  return (
    <div className="display-related">
      <h1>You Might Also Like</h1>
      <div className="display-related-products">
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            bestseller={item.bestseller}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
