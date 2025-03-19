import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import emailjs from "@emailjs/browser";
import "./OtpVerify.css";
import { assets } from "../../assets/assets";

const OtpVerify = ({ email, generatedOtp }) => {
  const [otp, setOtp] = useState("");
  const { backendUrl, setToken } = useContext(ShopContext);
  const navigate = useNavigate();
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/user/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("OTP verified");
        navigate(-1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setTimeLeft(60);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const templateParams = {
        to_email: email,
        otp: otp,
      };

      await emailjs.send(
        "service_z9ppajx",
        "template_8xp29i9",
        templateParams,
        "pqCz261Ss0EpuiGS2"
      );

      await axios.post(backendUrl + "/api/user/resend-otp", {
        email,
        otp: otp,
      });

      toast.success("OTP Resent Successfully");
    } catch (error) {
      toast.error("Failed to resend OTP");
      console.error("Resend OTP error:", error);
    } finally {
      setResendLoading(false);
    }
  };

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
        {timeLeft > 0 ? (
          <p>OTP expiring in: {formatTime(timeLeft)}</p>
        ) : (
          <p>OTP Expired.</p>
        )}
        <button
          className="otp-resend-button"
          onClick={handleResend}
          disabled={resendLoading || timeLeft > 0}
        >
          {resendLoading ? "Resending...." : "Resend OTP"}
        </button>
        <p className="otp-trouble">
          Having trouble receiving the OTP? Click resend.
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;
