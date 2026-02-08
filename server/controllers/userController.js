import userModel from "../models/userModel.js";
import valaditor from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOtp";
import transporter from "../utils/sendMail";

const admin_email = process.env.ADMIN_EMAIL;
const admin_password = process.env.ADMIN_PASSWORD;

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
        const otp = generateOTP();

        user.otp = otp;
        user.otpExpiration = new Date(Date.now() + 2 * 60 * 1000);
        await user.save();

        await transporter.sendMail({
          from: `"Rare Fashion" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Verify Your Account - Rare Fashion",
          html: `
  <div style="
    max-width: 480px;
    margin: 0 auto;
    padding: 24px;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #ffffff;
    border-radius: 8px;
  ">
    <h2 style="margin-top: 0; color: #111;">Welcome to Rare Fashion</h2>

    <p>Hi,</p>

    <p>
      Thank you for signing up with <strong>Rare Fashion</strong>.
      Please use the OTP below to verify your email address:
    </p>

    <div style="
      margin: 24px 0;
      padding: 16px;
      background: #f4f4f4;
      border-radius: 6px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 4px;
    ">
      ${otp}
    </div>

    <p>
      This OTP is valid for <strong>2 minutes</strong>.
      Please do not share it with anyone.
    </p>

    <p>
      If you did not create an account with Rare Fashion,
      you can safely ignore this email.
    </p>

    <p style="margin-top: 32px;">
      Regards,<br/>
      <strong>Team Rare Fashion</strong>
    </p>
  </div>
`,
        });

        return res.json({
          success: false,
          message: "OTP sent to email. Please verify your account.",
        });
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
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    if (!valaditor.isEmail(email)) {
      return res.json({ success: false, message: "Enter a Valid Email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000); // 2 min

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiration,
      verified: false,
    });

    await newUser.save();

    // Send OTP email
    await transporter.sendMail({
      from: `"Rare Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP - Rare Fashion",
      html: `
  <div style="
    max-width: 480px;
    margin: 0 auto;
    padding: 24px;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #ffffff;
    border-radius: 8px;
  ">
    <h2 style="margin-top: 0; color: #111;">Welcome to Rare Fashion</h2>

    <p>Hi,</p>

    <p>
      Thank you for signing up with <strong>Rare Fashion</strong>.
      Please use the OTP below to verify your email address:
    </p>

    <div style="
      margin: 24px 0;
      padding: 16px;
      background: #f4f4f4;
      border-radius: 6px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 4px;
    ">
      ${otp}
    </div>

    <p>
      This OTP is valid for <strong>2 minutes</strong>.
      Please do not share it with anyone.
    </p>

    <p>
      If you did not create an account with Rare Fashion,
      you can safely ignore this email.
    </p>

    <p style="margin-top: 32px;">
      Regards,<br/>
      <strong>Team Rare Fashion</strong>
    </p>
  </div>
`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Registration error:", error);
    res.json({ success: false, message: "Registration failed" });
  }
};

// Admin

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === admin_email && password === admin_password) {
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
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + 2 * 60 * 1000);

    await user.save();

    await transporter.sendMail({
      from: `"Rare Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Resend OTP - Rare Fashion",
      html: `
  <div style="
    max-width: 480px;
    margin: 0 auto;
    padding: 24px;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #ffffff;
    border-radius: 8px;
  ">
    <h2 style="margin-top: 0; color: #111;">Rare Fashion</h2>

    <p>Hi,</p>

    <p>
      As requested, here is your new OTP to verify your
      <strong>Rare Fashion</strong> account:
    </p>

    <div style="
      margin: 24px 0;
      padding: 16px;
      background: #f4f4f4;
      border-radius: 6px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 4px;
    ">
      ${otp}
    </div>

    <p>
      This OTP is valid for <strong>2 minutes</strong>.
      Do not share this code with anyone.
    </p>

    <p style="margin-top: 32px;">
      Regards,<br/>
      <strong>Team Rare Fashion</strong>
    </p>
  </div>
`,
    });

    res.json({ success: true, message: "OTP resent" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.json({ success: false, message: "Failed to resend OTP" });
  }
};

export { loginUser, registerUser, adminLogin, resendOTP, verifyOTP };
