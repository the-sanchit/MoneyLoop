import React, { useState } from "react";

const CURRENCIES = [
  { symbol: "₹", name: "Indian Rupee (₹)" },
  { symbol: "$", name: "US Dollar ($)" },
  { symbol: "€", name: "Euro (€)" },
  { symbol: "£", name: "British Pound (£)" },
];

function Settings({ settings, setSettings, onClearData }) {
  const [tempName, setTempName] = useState(settings.username || "Admin");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings({ ...settings, username: tempName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCurrencyChange = (e) => {
    setSettings({ ...settings, currency: e.target.value });
  };

  const handleClear = () => {
    if (window.confirm("⚠️ Are you sure? This will delete ALL your data including expenses, goals, and budget.")) {
      onClearData();
    }
  };

  return (
    <div>
      <div className="card">
        <h2>⚙️ General Settings</h2>

        <div className="settings-section">
          <h3>Profile</h3>
          <div className="settings-row">
            <label>Display Name</label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <button className="btn-main" onClick={handleSave} style={{ marginTop: "16px" }}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="settings-section" style={{ marginTop: "28px" }}>
          <h3>Currency</h3>
          <div className="settings-row">
            <label>Currency Symbol</label>
            <select value={settings.currency || "₹"} onChange={handleCurrencyChange}>
              {CURRENCIES.map((c) => (
                <option key={c.symbol} value={c.symbol}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>🗑️ Data Management</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
          Clear all your saved data. This action cannot be undone.
        </p>
        <button className="logout" onClick={handleClear}>
          Clear All Data
        </button>
      </div>

      <div className="card">
        <h2>ℹ️ About MoneyLoop</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
          MoneyLoop is a smart budget planner that helps you track expenses,
          set financial goals, and manage your money wisely. Built with React.js.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "8px" }}>
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}

export default Settings;
