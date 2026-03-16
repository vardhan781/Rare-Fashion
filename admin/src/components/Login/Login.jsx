import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { backendUrl } from "../../App";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import { Mail, Lock } from "lucide-react";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

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
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="login-page">
      <form onSubmit={onSubmitHandler} className="login-form">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Enter your credentials to continue</p>
        </div>

        <div className="input-field">
          <Mail size={20} className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-field">
          <Lock size={20} className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
