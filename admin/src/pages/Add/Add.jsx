import { useState, useRef } from "react";
import "./Add.css";
import { Plus, X, ImageIcon, ChevronDown } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../../App";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";

const Add = ({ token }) => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const fileInputRef = useRef(null);

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];
  const categories = ["Denim", "Dresses", "Casual", "Formal"];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestSeller);
      image && formData.append("image", image);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setImage(false);
        setBestSeller(false);
        setSizes([]);
        setCategory("");
      } else {
        toast.error("Error Occured");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="add-page">
      <div className="add-header">
        <h1>Add New Product</h1>
        <p>Fill in the details below to add a new product</p>
      </div>

      <form onSubmit={onSubmitHandler} className="add-form">
        <div className="form-section">
          <label className="section-label">Product Image</label>
          <div className="image-upload-area">
            {image ? (
              <div className="image-preview">
                <img src={URL.createObjectURL(image)} alt="Preview" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="remove-image-btn"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="upload-area" htmlFor="image">
                <div className="upload-placeholder">
                  <ImageIcon size={24} />
                  <div>
                    <div className="upload-text">Upload Image</div>
                    <small>JPG, PNG (Max 2MB)</small>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  type="file"
                  id="image"
                  hidden
                  accept="image/*"
                />
              </label>
            )}
          </div>
        </div>

        <div className="form-section">
          <label className="section-label" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-section">
          <label className="section-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            required
          ></textarea>
        </div>

        <div className="form-section">
          <label className="section-label">Category</label>
          <div className="custom-select">
            <div
              className="select-header"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span className={category ? "selected-value" : "placeholder"}>
                {category || "Select category"}
              </span>
              <ChevronDown
                size={18}
                className={`dropdown-icon ${showCategoryDropdown ? "open" : ""}`}
              />
            </div>

            {showCategoryDropdown && (
              <div className="dropdown-options">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`option ${category === cat ? "selected" : ""}`}
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <label className="section-label" htmlFor="price">
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            min="1"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-section">
          <label className="section-label">Available Sizes</label>
          <div className="sizes-container">
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`size-option ${sizes.includes(size) ? "selected" : ""}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
            />
            <span>Mark as Best Seller</span>
          </label>
        </div>

        <button type="submit" className="submit-btn">
          <Plus size={18} />
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
