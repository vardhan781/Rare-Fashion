import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add Product

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, bestseller, sizes } = req.body;
    const image = req.files.image[0];
    const images = [image].filter((item) => item !== undefined);

    let imagesURL = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      sizes: JSON.parse(sizes),
      image: imagesURL[0],
      date: Date.now(),
      bestseller: bestseller === "true",
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List

const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Single

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// BestSeller Property

const updateBestSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { bestseller } = req.body;

    const product = await productModel.findByIdAndUpdate(
      id,
      { bestseller },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  listProduct,
  removeProduct,
  singleProduct,
  addProduct,
  updateBestSeller,
};
