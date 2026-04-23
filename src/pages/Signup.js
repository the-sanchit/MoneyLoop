import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { api } from "../services/api";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const response = await api.signup({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", response.user.email);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">

      <div className="login-left">
        <h1 className="animate-fade-up">Create Account</h1>
        <p className="animate-fade-up" style={{animationDelay: "0.1s"}}>Start managing your finances smartly today.</p>

        <div className="feature-box animate-fade-up" style={{animationDelay: "0.2s"}}>
          <h3>Custom Goals</h3>
          <p>Set personalized financial goals to stay motivated.</p>
        </div>

        <div className="feature-box animate-fade-up" style={{animationDelay: "0.3s"}}>
          <h3>AI Powered</h3>
          <p>Get instant insights from our AI financial advisor.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-theme-toggle">
          <ThemeToggle />
        </div>
        <form className="login-form animate-fade-up" onSubmit={handleSignup} style={{animationDelay: "0.2s"}}>
          <h2>Sign Up</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-main" type="submit">Create Account</button>
          
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Sign In</span>
          </p>
        </form>
      </div>

    </div>
  );
}

export default Signup;
