import React, { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import { backendUrl } from "../../App";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Successfully Logged In");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={onSubmitHandler} className="admin-login">
      <div className="admin-container">
        <h1>Admin Login</h1>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
        />
        <button>Login</button>
      </div>
    </form>
  );
};

export default Login;
