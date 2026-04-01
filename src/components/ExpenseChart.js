import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CATEGORY_COLORS = {
  Food: "#ef4444",
  Transport: "#3b82f6",
  Shopping: "#a855f7",
  Bills: "#f59e0b",
  Entertainment: "#ec4899",
  Health: "#22c55e",
  Other: "#94a3b8",
};

function ExpenseChart({ expenses }) {
  if (!expenses.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <p>No expense data to visualize yet.</p>
      </div>
    );
  }

  // Group by category
  const categoryTotals = {};
  expenses.forEach((item) => {
    const cat = item.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + item.amount;
  });

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);
  const colors = categories.map((cat) => CATEGORY_COLORS[cat] || "#94a3b8");

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Spending by Category",
        data: amounts,
        backgroundColor: colors.map((c) => c + "CC"),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148,163,184,0.1)" },
        ticks: { color: "#94a3b8", font: { family: "'Outfit', sans-serif", size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { family: "'Outfit', sans-serif", size: 11 } },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#94a3b8", padding: 20, font: { family: "'Outfit', sans-serif", size: 12, weight: '500' } },
      },
    },
  };

  return (
    <div className="charts-row">
      <div>
        <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Distribution</h3>
        <div style={{ maxWidth: "320px", margin: "0 auto" }}>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>By Category</h3>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
}

export default ExpenseChart;
