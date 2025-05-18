import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css"; // Importing styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password cannot be empty.", { position: "top-center", autoClose: 3000 });
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim() === "admin" ? "admin@gmail.com" : email.trim(), password);
      localStorage.setItem("role", "Admin");

      toast.success("Login successful! Redirecting...", { position: "top-center", autoClose: 2000 });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.", { position: "top-center", autoClose: 3000 });
      console.error("Login Error:", error.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-content">
        <div className="login-box">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className="input-group password-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <span
                  className={`eye-icon ${password.length === 0 ? "disabled" : ""}`}
                  onClick={() => password.length > 0 && setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
