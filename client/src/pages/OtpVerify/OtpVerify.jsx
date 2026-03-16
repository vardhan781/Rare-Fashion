import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import "./OtpVerify.css";
import Loader from "../../components/Loader/Loader";
import { Key, RefreshCw, ArrowLeft, Shield } from "lucide-react";

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
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

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
        navigate("/", { replace: true });
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
    if (timeLeft > 0 && !resendLoading) {
      toast.error(`Please wait ${timeLeft} seconds before resending`);
      return;
    }

    setResendLoading(true);
    try {
      await axios.post(backendUrl + "/api/user/resend-otp", { email });
      setTimeLeft(120);
      toast.success("OTP resent to email");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <Loader />;

  return (
    <div className="otp-verification-screen">
      <div className="otp-verification-container">
        <div className="otp-verification-header">
          <button
            type="button"
            className="otp-back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="otp-verification-title">Verify OTP</h2>
          <div className="otp-header-spacer"></div>
        </div>

        <div className="otp-verification-icon">
          <Shield size={48} />
        </div>

        <p className="otp-verification-info">
          Enter the 6-digit OTP sent to
          <br />
          <span className="otp-email-text">{email}</span>
        </p>

        <div className="otp-input-container">
          <div className="otp-input-wrapper">
            <Key size={20} className="otp-input-icon" />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength="6"
              className="otp-code-input"
            />
          </div>
        </div>

        <div className="otp-timer-section">
          <p className="otp-timer-text">
            OTP expires in:{" "}
            <span className="otp-timer-count">{formatTime(timeLeft)}</span>
          </p>
        </div>

        <div className="otp-action-buttons">
          <button
            type="button"
            onClick={handleVerify}
            className="otp-verify-button"
            disabled={!otp.trim()}
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0 || resendLoading}
            className="otp-resend-button"
          >
            <RefreshCw
              size={16}
              className={resendLoading ? "otp-spinning" : ""}
            />
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>

        <p className="otp-verification-note">
          Didn't receive OTP? Check your spam folder or request a new one.
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;
