import React from "react";

function Budget({ budget, setBudget, expenses, currency = "₹" }) {
  const totalExpenses = expenses.reduce(
    (total, item) => total + item.amount,
    0
  );

  const remaining = budget - totalExpenses;

  return (
    <div className="card">
      <h2>💰 Set Budget</h2>
      <div className="card-form">
        <input
          type="number"
          placeholder="Enter Budget"
          value={budget || ""}
          onChange={(e) => setBudget(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>
        Total Expenses: <strong style={{ color: "var(--text-secondary)" }}>{currency}{totalExpenses}</strong>
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
        Remaining: <strong style={{ color: remaining >= 0 ? "#22c55e" : "#ef4444" }}>{currency}{remaining}</strong>
      </p>
    </div>
  );
}

export default Budget;
