import React, { useContext, useEffect, useState, useRef } from "react";
import "./Collection.css";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../Context/ShopContext";
import ProductItem from "../../components/ProductItem/ProductItem";
import Fuse from "fuse.js";
import Loader from "../../components/Loader/Loader";
import { Search, ChevronDown, Filter, X } from "lucide-react";

const Collection = () => {
  const { products, category, toggleCategory, productLoading } =
    useContext(ShopContext);
  const [collection, setCollection] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("preference");
  const [noResults, setNoResults] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const searchInputRef = useRef(null);
  const sortRef = useRef(null);

  const sortOptions = [
    { value: "preference", label: "Preference" },
    { value: "high-low", label: "Price: High to Low" },
    { value: "low-high", label: "Price: Low to High" },
  ];

  const categories = [
    { value: "Casual", label: "Casual" },
    { value: "Denim", label: "Denim" },
    { value: "Formal", label: "Formal" },
    { value: "Dresses", label: "Dresses" },
  ];

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
        category.includes(item.category),
      );
    }

    if (sortOption === "high-low") {
      productsCopy.sort((a, b) => b.price - a.price);
    } else if (sortOption === "low-high") {
      productsCopy.sort((a, b) => a.price - b.price);
    }

    setCollection(productsCopy);
    setNoResults(productsCopy.length === 0);
  };

  const handleSortSelect = (value) => {
    setSortOption(value);
    setIsSortOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchInputRef.current?.blur();
    }
  };

  const handleClearFilters = () => {
    const checkboxes = document.querySelectorAll(
      '.category-checkbox input[type="checkbox"]',
    );
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.click();
      }
    });
    setSearch("");
    setSortOption("preference");
  };

  const getSelectedCount = () => {
    return category.length;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    applyFilter();
  }, [category, search, products, sortOption]);

  useEffect(() => {
    setCollection(products);
    setNoResults(false);
  }, [products]);

  if (productLoading) {
    return <Loader />;
  }

  const selectedSort = sortOptions.find((opt) => opt.value === sortOption);

  return (
    <div className="collect">
      {/* Left Section */}
      <div className="left-collect">
        <div className="filter-card">
          <div className="sort-section">
            <h3>
              <Filter size={16} /> Sort By
            </h3>
            <div className="custom-select" ref={sortRef}>
              <button
                className="select-trigger"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="sort-selected">{selectedSort.label}</span>
                <ChevronDown
                  size={16}
                  className={`chevron ${isSortOpen ? "rotate" : ""}`}
                />
              </button>

              {isSortOpen && (
                <div className="select-dropdown">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`select-option ${sortOption === option.value ? "selected" : ""}`}
                      onClick={() => handleSortSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="category-section">
            <div className="filter-header">
              <h3>
                <Filter size={16} /> Categories
              </h3>
              {getSelectedCount() > 0 && (
                <button
                  className="clear-categories"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="category-list">
              {categories.map((cat) => (
                <label key={cat.value} className="category-checkbox">
                  <input
                    type="checkbox"
                    value={cat.value}
                    checked={category.includes(cat.value)}
                    onChange={toggleCategory}
                  />
                  <span className="custom-checkbox">
                    {category.includes(cat.value) && (
                      <div className="check-icon">✓</div>
                    )}
                  </span>
                  <span className="category-label">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-collect">
        <div className="search-section">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              ref={searchInputRef}
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Find your perfect outfit..."
              maxLength="50"
            />
            {search && (
              <button className="clear-search" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>

          <div className="results-info">
            <p>
              Showing <span className="count">{collection.length}</span>{" "}
              products
              {search && (
                <>
                  {" "}
                  for "<span className="search-term">{search}</span>"
                </>
              )}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          {noResults ? (
            <div className="no-results">
              <img src={assets.no_products} alt="No products found" />
              <p>No matching products found</p>
              <button className="reset-btn" onClick={handleClearFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {collection.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  bestseller={item.bestseller}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
