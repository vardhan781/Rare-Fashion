import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  placeOrderForApp,
} from "../controllers/orderController.js";
import admimAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/list", admimAuth, allOrders);
orderRouter.post("/status", admimAuth, updateStatus);
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/place-app", placeOrderForApp);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/userorders", authUser, userOrders);
orderRouter.post("/verifyStripe", authUser, verifyStripe);

export default orderRouter;
