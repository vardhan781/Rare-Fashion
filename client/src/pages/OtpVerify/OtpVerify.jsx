import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import "./OtpVerify.css";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader/Loader";

const OtpVerify = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { backendUrl, setToken } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await axios.post(backendUrl + "/api/user/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        toast.success("Verified successfully");
        navigate(-1);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setTimeLeft(120);

    try {
      await axios.post(backendUrl + "/api/user/resend-otp", { email });
      toast.success("OTP resent to email");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="otp-verify">
      <div className="otp-container">
        <h2>Verify OTP</h2>

        <div className="otp-input-field">
          <div className="otp-img-set">
            <img src={assets.otp} alt="" />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button onClick={handleVerify}>Verify</button>
        </div>

        <p>
          OTP expires in {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>

        <button onClick={handleResend} disabled={timeLeft > 0 || resendLoading}>
          {resendLoading ? "Resending" : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpVerify;
