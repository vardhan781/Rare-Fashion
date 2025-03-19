import userModel from "../models/userModel.js";
import valaditor from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const admin_email = "anjali@rarefashion.in";
const admin_password = "12345678";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't Exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      if (!user.verified) {
        return res.json({ success: false, message: "Please Verify" });
      }
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for register

const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    // Checking User Exists

    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    // Validate Email And Password
    if (!valaditor.isEmail(email)) {
      return res.json({ success: false, message: "Enter a Valid Email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }

    // Hashing

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    // Store OTP from the react body in database
    const otpExpiration = new Date(Date.now() + 60 * 1000);
    newUser.otp = otp;
    newUser.otpExpiration = otpExpiration;

    await newUser.save();

    res.json({
      success: true,
      message: "OTP sent",
      otp,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Admin

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === admin_email &&
      password === admin_password
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({
        success: false,
        message: "Email & OTP required",
      });
    }

    // Retrieve user from database
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.otp) {
      return res.json({ success: false, message: "OTP not found" });
    }

    if (user.otpExpiration < new Date()) {
      user.otp = null;
      user.otpExpiration = null;
      await user.save();
      return res.json({ success: false, message: "OTP expired" });
    }

    if (String(otp.trim()) === String(user.otp.trim())) {
      user.otp = null;
      user.otpExpiration = null;
      user.verified = true;
      await user.save();

      const token = createToken(user._id);
      res.json({ success: true, message: "User verified", token });
    } else {
      return res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("verifyOTP error:", error);
    return res.json({ success: false, message: "Server Error" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Retrieve user from database
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Update OTP in database
    const otpExpiration = new Date(Date.now() + 60 * 1000);
    user.otp = otp;
    user.otpExpiration = otpExpiration;

    await user.save();

    res.json({ success: true, message: "OTP Resent", otp });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.json({ success: false, message: "Failed to resend OTP" });
  }
};

export { loginUser, registerUser, adminLogin, resendOTP, verifyOTP };
