import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [price, setPrice] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
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
        { headers: { token } }
      );
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setImage(false);
        setBestSeller(false);
      } else {
        toast.error("Error Occured");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="adding-product">
      <div className="upload-image">
        <p>Upload Image</p>
        <label className="upload-file-choose" htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>
      </div>
      <div className="upload-name">
        <p>Product Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </div>
      <div className="upload-desc">
        <p>Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="both-cat-price">
        <div className="upload-category">
          <p>Product Category</p>
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="Denim">Denim</option>
            <option value="Dresses">Dresses</option>
            <option value="Casual">Casual</option>
            <option value="Formal">Formal</option>
          </select>
        </div>
        <div className="upload-price">
          <p>Product Price</p>
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="upload-sizes">
        <div
          onClick={() =>
            setSizes((prev) =>
              prev.includes("S")
                ? prev.filter((item) => item !== "S")
                : [...prev, "S"]
            )
          }
        >
          <p
            className={`${
              sizes.includes("S") ? "individual-size-selected" : ""
            }  individual-size`}
          >
            S
          </p>
        </div>
        <div
          onClick={() =>
            setSizes((prev) =>
              prev.includes("M")
                ? prev.filter((item) => item !== "M")
                : [...prev, "M"]
            )
          }
        >
          <p
            className={`${
              sizes.includes("M") ? "individual-size-selected" : ""
            }  individual-size`}
          >
            M
          </p>
        </div>
        <div
          onClick={() =>
            setSizes((prev) =>
              prev.includes("L")
                ? prev.filter((item) => item !== "L")
                : [...prev, "L"]
            )
          }
        >
          <p
            className={`${
              sizes.includes("L") ? "individual-size-selected" : ""
            }  individual-size`}
          >
            L
          </p>
        </div>
        <div
          onClick={() =>
            setSizes((prev) =>
              prev.includes("XL")
                ? prev.filter((item) => item !== "XL")
                : [...prev, "XL"]
            )
          }
        >
          <p
            className={`${
              sizes.includes("XL") ? "individual-size-selected" : ""
            }  individual-size`}
          >
            XL
          </p>
        </div>
        <div
          onClick={() =>
            setSizes((prev) =>
              prev.includes("XXL")
                ? prev.filter((item) => item !== "XXL")
                : [...prev, "XXL"]
            )
          }
        >
          <p
            className={`${
              sizes.includes("XXL") ? "individual-size-selected" : ""
            }  individual-size`}
          >
            XXL
          </p>
        </div>
      </div>
      <div className="bestseller-checkbox">
        <label>
          Best Seller :
          <input
            type="checkbox"
            checked={bestSeller}
            onChange={(e) => setBestSeller(e.target.checked)}
          />
        </label>
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default Add;
