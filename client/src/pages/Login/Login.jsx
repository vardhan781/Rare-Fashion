import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";
import OtpVerify from "../OtpVerify/OtpVerify";
import Loader from "../../components/Loader/Loader";

const Login = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(ShopContext);

  const [currState, setCurrState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
          navigate(-1);
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

  useEffect(() => {
    if (token) navigate(-1);
  }, [token, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="login">
      {otpSent ? (
        <OtpVerify email={email} />
      ) : (
        <form onSubmit={onSubmitHandler} className="contain">
          <div className="head">
            <h1>{currState}</h1>
            <img
              src={assets.cross_icon}
              alt="close"
              onClick={() => navigate(-1)}
            />
          </div>

          <div className="inputs">
            {currState === "Sign Up" && (
              <div className="detail">
                <img src={assets.user} alt="" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </div>
            )}

            <div className="detail">
              <img src={assets.email} alt="" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="detail">
              <img src={assets.password} alt="" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Your Password"
                required
              />
            </div>
          </div>

          <div className="subs">
            <button>{currState}</button>
            <p>
              {currState === "Login" ? (
                <>
                  Don’t have an account?
                  <span onClick={() => setCurrState("Sign Up")}> Sign Up</span>
                </>
              ) : (
                <>
                  Already a user?
                  <span onClick={() => setCurrState("Login")}> Login</span>
                </>
              )}
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
