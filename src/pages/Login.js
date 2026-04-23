import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/logo.jpeg";
import ThemeToggle from "../components/ThemeToggle";
import { api } from "../services/api";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter credentials");
      return;
    }

    try {
      const response = await api.login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", response.user.email);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <img src={logo} alt="MoneyLoop" className="animate-fade-up" style={{width:"120px", marginBottom:"24px", borderRadius: "24px", boxShadow: "0 12px 30px rgba(0,0,0,0.2)"}} />
        <h1 className="animate-fade-up" style={{animationDelay: "0.1s"}}>MoneyLoop</h1>
        <p className="animate-fade-up" style={{animationDelay: "0.2s"}}>Manage your finances smarter than ever.</p>


        <div className="feature-box animate-fade-up" style={{animationDelay: "0.3s"}}>
          <h3>Secure</h3>
          <p>Your data is encrypted and protected.</p>
        </div>

        <div className="feature-box animate-fade-up" style={{animationDelay: "0.4s"}}>
          <h3>Analytics</h3>
          <p>Track expenses with real-time insights.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-theme-toggle">
          <ThemeToggle />
        </div>
        <form className="login-form animate-fade-up" onSubmit={handleLogin} style={{animationDelay: "0.2s"}}>
          <h2>Welcome Back 👋</h2>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign In</button>

          <p>
            Don't have account?{" "}
            <span onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
        </form>
      </div>

    </div>
  );
}

export default Login;
