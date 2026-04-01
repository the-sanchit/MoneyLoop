import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = {
  Food: "#ef4444",
  Transport: "#3b82f6",
  Shopping: "#a855f7",
  Bills: "#f59e0b",
  Entertainment: "#ec4899",
  Health: "#22c55e",
  Other: "#94a3b8",
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

function Reports({ budget, expenses, currency = "₹" }) {
  const totalExpenses = expenses.reduce((total, item) => total + item.amount, 0);
  const remaining = budget - totalExpenses;
  const spentPercent = budget > 0 ? Math.round((totalExpenses / budget) * 100) : 0;

  // Category breakdown
  const categoryTotals = {};
  expenses.forEach((item) => {
    const cat = item.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + item.amount;
  });

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);
  const colors = categories.map((cat) => CATEGORY_COLORS[cat] || "#94a3b8");

  // Top 3 expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Doughnut chart data
  const doughnutData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#9ca3b4", padding: 14, font: { size: 12 } },
      },
    },
  };

  return (
    <div>
      {/* Summary Stats */}
      <div className="reports-grid">
        <div className="report-stat">
          <h4>Total Budget</h4>
          <p className="purple">{currency}{budget}</p>
        </div>
        <div className="report-stat">
          <h4>Total Spent</h4>
          <p className="red">{currency}{totalExpenses}</p>
        </div>
        <div className="report-stat">
          <h4>Remaining</h4>
          <p className={remaining >= 0 ? "green" : "red"}>{currency}{remaining}</p>
        </div>
        <div className="report-stat">
          <h4>Status</h4>
          <p className={remaining >= 0 ? "green" : "red"}>
            {remaining < 0 ? "⚠️ Over Budget" : `✅ ${spentPercent}% Used`}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <div className="card">
          <h2>📊 Category Breakdown</h2>
          <div className="charts-row">
            <div style={{ maxWidth: "280px" }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div style={{ flex: 1 }}>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={cat}>
                      <td>
                        <span className={`category-badge ${CATEGORY_CLASS[cat] || "cat-other"}`}>
                          {cat}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{currency}{amounts[i]}</td>
                      <td style={{ color: "#9ca3b4" }}>
                        {totalExpenses > 0 ? Math.round((amounts[i] / totalExpenses) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Top Expenses */}
      {topExpenses.length > 0 && (
        <div className="card">
          <h2>🏆 Top Expenses</h2>
          <ul className="top-expenses-list">
            {topExpenses.map((item, i) => (
              <li key={i} className="top-expense-item">
                <div>
                  <span className="rank">#{i + 1}</span>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span
                    className={`category-badge ${CATEGORY_CLASS[item.category] || "cat-other"}`}
                    style={{ marginLeft: 10 }}
                  >
                    {item.category || "Other"}
                  </span>
                </div>
                <span className="expense-amount">{currency}{item.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>Add some expenses to see your financial reports here.</p>
        </div>
      )}
    </div>
  );
}

export default Reports;
