import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      id="theme-toggle-btn"
    >
      <span className="theme-toggle-icon">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}

export default ThemeToggle;
