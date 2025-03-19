import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  verifyOTP,
  resendOTP,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/resend-otp", resendOTP);

export default userRouter;
