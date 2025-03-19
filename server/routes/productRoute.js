import express from "express";
import {
  addProduct,
  removeProduct,
  listProduct,
  singleProduct,
  updateBestSeller,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addProduct
);
productRouter.get("/list", listProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.put("/products/:id/bestseller", adminAuth, updateBestSeller);

export default productRouter;
