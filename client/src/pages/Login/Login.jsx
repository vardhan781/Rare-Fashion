import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import OtpVerify from "../OtpVerify/OtpVerify";
import emailjs from "@emailjs/browser";

const Login = () => {
  const handleGoBack = () => {
    navigate(-1);
  };

  const [currState, setCurrState] = useState("Login");
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currState === "Sign Up") {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);

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

        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
          otp: otp,
        });

        if (response.data.success) {
          toast.success(response.data.message);
          setOtpSent(true);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Logged In");
          navigate(-1);
        } else {
          toast.error(response.data.message);
          if (response.data.message === "Please Verify") {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(otp);
            setOtpSent(true);

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
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (otpSent) {
    }
  }, [otpSent]);

  useEffect(() => {
    if (token) {
      navigate(-1);
    }
  }, [token, navigate]);

  return (
    <div className="login">
      {otpSent ? (
        <OtpVerify email={email} generatedOtp={generatedOtp} />
      ) : (
        <form onSubmit={onSubmitHandler} className="contain">
          <div className="head">
            <h1>{currState === "Sign Up" ? "Sign Up" : "Login"}</h1>
            <img onClick={handleGoBack} src={assets.cross_icon} alt="Go Back" />
          </div>

          <div className="inputs">
            {currState === "Sign Up" ? (
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
            ) : (
              ""
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
            <button>{currState === "Login" ? "Login" : "Sign Up"}</button> 
            {currState === "Sign Up" ? (
              <p>
                Already a User ?
                <span onClick={() => setCurrState("Login")}> Login here</span> 
              </p>
            ) : (
              <p>
                Don't have an Account ?
                <span onClick={() => setCurrState("Sign Up")}>
                  {" "}
                  Sign Up Here
                </span>
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
