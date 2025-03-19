import React, { useContext, useEffect, useState, useRef } from "react";
import "./Collection.css";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../Context/ShopContext";
import ProductItem from "../../components/ProductItem/ProductItem";
import Fuse from "fuse.js";

const Collection = () => {
  const { products, category, toggleCategory } = useContext(ShopContext);
  const [collection, setCollection] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("preference");
  const [noResults, setNoResults] = useState(false);
  const searchInputRef = useRef(null);

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (search) {
      const fuse = new Fuse(productsCopy, {
        keys: ["name", "category", "description", "tag"],
        threshold: 0.4,
        distance: 600,
      });

      const result = fuse.search(search);
      productsCopy = result.map(({ item }) => item);
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (sortOption === "high-low") {
      productsCopy.sort((a, b) => b.price - a.price);
    } else if (sortOption === "low-high") {
      productsCopy.sort((a, b) => a.price - b.price);
    }

    setCollection(productsCopy);
    setNoResults(productsCopy.length === 0 && search !== "");
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchInputRef.current.blur();
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, search, products, sortOption]);

  useEffect(() => {
    setCollection(products);
    setNoResults(false);
  }, [products]);

  return (
    <div className="collect">
      {/* Left Sec */}
      <div className="left-collect">
        <div className="categories">
          <h1>Categories</h1>
          <div className="cats">
            <div className="name-cats">
              <input
                value={"Casual"}
                type="checkbox"
                onChange={toggleCategory}
              />
              <p>Casual</p>
            </div>

            <div className="name-cats">
              <input
                value={"Denim"}
                type="checkbox"
                onChange={toggleCategory}
              />
              <p>Denim</p>
            </div>

            <div className="name-cats">
              <input
                value={"Formal"}
                type="checkbox"
                onChange={toggleCategory}
              />
              <p>Formal</p>
            </div>

            <div className="name-cats">
              <input
                value={"Dresses"}
                type="checkbox"
                onChange={toggleCategory}
              />
              <p>Dresses</p>
            </div>
          </div>
          <h1>Sort By</h1>
          <select value={sortOption} onChange={handleSort}>
            <option value="preference">Preference</option>
            <option value="high-low">High To Low</option>
            <option value="low-high">Low To High</option>
          </select>
        </div>
      </div>
      {/* Right Sec */}
      <div className="right-collect">
        <div className="search-box">
          <img src={assets.search} alt="" />
          <input
            ref={searchInputRef}
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Find Your Fashion Here!"
            maxLength="50"
          />
        </div>
        {/* Rendering Products From Product Item */}
        <div className="products">
          {noResults ? (
            <div className="no-products-found">
              <img src={assets.no_products} alt="" />
              <p>
                Umm... No results found for the <br /> "{search}"
              </p>
            </div>
          ) : (
            collection.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                bestseller={item.bestseller}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
