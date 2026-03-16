import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";
import OtpVerify from "../OtpVerify/OtpVerify";
import Loader from "../../components/Loader/Loader";
import { User, Mail, Lock, X, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(ShopContext);

  const [currState, setCurrState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currState === "Sign Up") {
        const res = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (res.data.success) {
          toast.success("OTP sent to email");
          setOtpSent(true);
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          toast.success("Logged In");
          navigate("/", { replace: true });
        } else {
          toast.error(res.data.message);

          if (res.data.message.includes("OTP")) {
            setOtpSent(true);
          }
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="auth-screen">
      {otpSent ? (
        <OtpVerify email={email} />
      ) : (
        <div className="auth-wrapper">
          <form onSubmit={onSubmitHandler} className="auth-form-card">
            <div className="auth-form-header">
              <h1 className="auth-form-title">{currState}</h1>
              <button
                type="button"
                className="auth-close-button"
                onClick={() => navigate(-1)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="auth-form-inputs">
              {currState === "Sign Up" && (
                <div className="auth-input-field">
                  <div className="auth-input-icon">
                    <User size={20} />
                  </div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Your Name"
                    required
                    className="auth-input"
                  />
                </div>
              )}

              <div className="auth-input-field">
                <div className="auth-input-icon">
                  <Mail size={20} />
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Your Email"
                  required
                  className="auth-input"
                />
              </div>

              <div className="auth-input-field">
                <div className="auth-input-icon">
                  <Lock size={20} />
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-form-footer">
              <button type="submit" className="auth-submit-button">
                {currState}
              </button>

              <p className="auth-switch-text">
                {currState === "Login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="auth-switch-button"
                      onClick={() => setCurrState("Sign Up")}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already a user?{" "}
                    <button
                      type="button"
                      className="auth-switch-button"
                      onClick={() => setCurrState("Login")}
                    >
                      Login
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
