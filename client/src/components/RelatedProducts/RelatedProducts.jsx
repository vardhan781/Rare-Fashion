import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { ProductItem } from "../ProductItem/ProductItem";
import "./RelatedProducts.css";

const RelatedProducts = ({ category }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.filter((item) => category === item.category);

      const shuffledProducts = shuffleArray(productsCopy);

      setRelated(shuffledProducts.slice(0, 4));
    }
  }, [products, category]);
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
