import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import ThemeToggle from "../components/ThemeToggle";

function Landing() {
  return (
    <div className="landing">
      <div className="landing-theme-toggle animate-fade-up">
        <ThemeToggle />
      </div>
      <img src={logo} alt="MoneyLoop Logo" className="landing-logo animate-fade-up" />

      <h1 className="animate-fade-up" style={{ animationDelay: '0.1s' }}>MoneyLoop</h1>
      <p className="animate-fade-up" style={{ animationDelay: '0.2s' }}>Plan your expenses, track goals and manage money smartly.</p>

      <div className="buttons animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <Link to="/login" className="btn-primary">Login</Link>
        <Link to="/signup" className="btn-secondary">Sign Up</Link>
      </div>
    </div>
  );
}

export default Landing;
