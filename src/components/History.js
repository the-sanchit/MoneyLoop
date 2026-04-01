import React from "react";

const CATEGORY_ICONS = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "📄",
  Entertainment: "🎬",
  Health: "💊",
  Other: "📌",
};

const CATEGORY_CLASS = {
  Food: "cat-food",
  Transport: "cat-transport",
  Shopping: "cat-shopping",
  Bills: "cat-bills",
  Entertainment: "cat-entertainment",
  Health: "cat-health",
  Other: "cat-other",
};

function History({ expenses, currency = "₹" }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <h2>📜 Transaction History</h2>
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <p>No transactions recorded yet.</p>
        </div>
      </div>
    );
  }

  // Sort by date (newest first) and group by date
  const sorted = [...expenses]
    .map((exp, idx) => ({ ...exp, _origIndex: idx }))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const groups = {};
  sorted.forEach((exp) => {
    const dateKey = exp.date
      ? new Date(exp.date).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Undated";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(exp);
  });

  return (
    <div className="card">
      <h2>📜 Transaction History</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
        {expenses.length} transaction{expenses.length !== 1 ? "s" : ""} • Total: {currency}
        {expenses.reduce((sum, e) => sum + e.amount, 0)}
      </p>

      {Object.entries(groups).map(([date, items]) => {
        const dayTotal = items.reduce((sum, e) => sum + e.amount, 0);
        return (
          <div key={date} className="history-date-group">
            <div className="history-date">
              {date} — {currency}{dayTotal}
            </div>
            {items.map((item, i) => {
              const cat = item.category || "Other";
              return (
                <div key={i} className="history-item">
                  <div className="history-left">
                    <div
                      className={`history-icon ${CATEGORY_CLASS[cat] || "cat-other"}`}
                      style={{ background: `rgba(148,163,184,0.1)` }}
                    >
                      {CATEGORY_ICONS[cat] || "📌"}
                    </div>
                    <div className="history-details">
                      <h4>{item.name}</h4>
                      <p>
                        <span className={`category-badge ${CATEGORY_CLASS[cat]}`}>{cat}</span>
                      </p>
                    </div>
                  </div>
                  <span className="expense-amount">-{currency}{item.amount}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default History;
