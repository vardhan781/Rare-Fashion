import jwt from "jsonwebtoken";
import adminConfig from "../admin";

const admin_email = adminConfig.email;
const admin_password = adminConfig.password;

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not authorized , Login again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode !== admin_email + admin_password) {
      return res.json({
        success: false,
        message: "Not authorized , Login again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
