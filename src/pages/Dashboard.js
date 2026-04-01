import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import Budget from "../components/Budget";
import Expense from "../components/Expense";
import Chatbot from "../components/Chatbot";
import ExpenseChart from "../components/ExpenseChart";
import Goals from "../components/Goals";
import Reports from "../components/Reports";
import History from "../components/History";
import Settings from "../components/Settings";
import ThemeToggle from "../components/ThemeToggle";
import { api } from "../services/api";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [settings, setSettings] = useState({ username: "Admin", currency: "₹" });
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const loadData = async () => {
      try {
        const data = await api.getData();
        setBudget(data.budget || 0);
        setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
        setGoals(Array.isArray(data.goals) ? data.goals : []);
        setSettings(data.settings || { username: "Admin", currency: "₹" });
      } catch (_error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Autosave user data to backend
  useEffect(() => {
    if (isLoading) return undefined;

    const timeoutId = setTimeout(() => {
      api
        .saveData({ budget, expenses, goals, settings })
        .catch(() => {});
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [budget, expenses, goals, settings, isLoading]);

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="main-content">
          <div className="header">
            <h1>Loading your data...</h1>
          </div>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((total, item) => total + item.amount, 0);
  const remaining = budget - totalExpenses;
  const spentPercent = budget > 0 ? Math.round((totalExpenses / budget) * 100) : 0;
  const currency = settings.currency || "₹";

  const handleClearData = async () => {
    setBudget(0);
    setExpenses([]);
    setGoals([]);
    setSettings((prev) => ({ ...prev, currency: prev.currency || "₹" }));
    try {
      await api.clearData();
    } catch (_error) {
      // Ignore clear API failure to keep UI responsive
    }
  };

  // Excel Download
  const downloadExcel = () => {
    // 1. Summary Data
    const summaryData = [
      { Header: "MoneyLoop Financial Summary", Value: "" }, 
      { Header: "Report Date", Value: new Date().toLocaleDateString() },
      { Header: "User", Value: settings.username || "Admin" },
      { Header: "Currency", Value: currency },
      { Header: "", Value: "" },
      { Header: "Metric", Value: "Amount" },
      { Header: "Total Budget", Value: budget },
      { Header: "Total Expenses", Value: totalExpenses },
      { Header: "Remaining Balance", Value: remaining },
      { Header: "Usage", Value: spentPercent + "%" },
      { Header: "Status", Value: spentPercent > 100 ? "⚠️ Over Budget" : "✅ On Track" }
    ];

    // 2. Category Breakdown
    const catMap = {};
    expenses.forEach(exp => {
      catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
    });
    const categoryData = Object.keys(catMap).map(cat => ({
      Category: cat,
      "Total Spent": catMap[cat],
      "Percentage (%)": totalExpenses > 0 ? ((catMap[cat] / totalExpenses) * 100).toFixed(1) + "%" : "0%"
    }));

    // 3. Raw Expenses
    const expenseData = expenses.map((exp) => ({
      Title: exp.name,
      Date: new Date(exp.date).toLocaleDateString(),
      Category: exp.category,
      Amount: exp.amount,
    }));
    
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryWS = XLSX.utils.json_to_sheet(summaryData, { skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Overview");

    // Breakdown Sheet
    const categoryWS = XLSX.utils.json_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(workbook, categoryWS, "Category Analysis");

    // Expenses Sheet
    const expenseWS = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(workbook, expenseWS, "Transaction History");

    XLSX.writeFile(workbook, `MoneyLoop_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Budget alert
  const getAlertInfo = () => {
    if (budget <= 0) return null;
    if (spentPercent > 100) return { class: "alert-over", text: `⚠️ Over budget by ${currency}${Math.abs(remaining)}! You've spent ${spentPercent}% of your budget.` };
    if (spentPercent >= 80) return { class: "alert-red", text: `🔴 Caution! ${spentPercent}% of budget used. Only ${currency}${remaining} remaining.` };
    if (spentPercent >= 50) return { class: "alert-yellow", text: `🟡 Heads up — ${spentPercent}% of budget used. ${currency}${remaining} left.` };
    return { class: "alert-green", text: `🟢 Looking good! Only ${spentPercent}% of budget used. ${currency}${remaining} remaining.` };
  };

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "expenses", label: "💳 Expenses" },
    { id: "goals", label: "🎯 Goals" },
    { id: "history", label: "📜 History" },
    { id: "reports", label: "📋 Reports" },
    { id: "settings", label: "⚙️ Settings" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "expenses":
        return (
          <div className="content-area">
            <Expense expenses={expenses} setExpenses={setExpenses} currency={currency} />
          </div>
        );
      case "goals":
        return (
          <div className="content-area">
            <Goals goals={goals} setGoals={setGoals} currency={currency} />
          </div>
        );
      case "history":
        return (
          <div className="content-area">
            <History expenses={expenses} currency={currency} />
          </div>
        );
      case "reports":
        return (
          <div className="content-area">
            <Reports budget={budget} expenses={expenses} currency={currency} />
          </div>
        );
      case "settings":
        return (
          <div className="content-area">
            <Settings
              settings={settings}
              setSettings={setSettings}
              onClearData={handleClearData}
            />
          </div>
        );
      default:
        const alert = getAlertInfo();
        return (
          <>
            {alert && (
              <div className={`alert-banner ${alert.class}`}>
                {alert.text}
              </div>
            )}

            <div className="stats-grid">
              <div className="stat-box">
                <h4>Total Budget</h4>
                <p>{currency} {budget}</p>
              </div>
              <div className="stat-box">
                <h4>Total Expenses</h4>
                <p>{currency} {totalExpenses}</p>
              </div>
              <div className="stat-box">
                <h4>Remaining</h4>
                <p>{currency} {remaining}</p>
              </div>
            </div>

            <div className="chart-section animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <h2>Expense Overview</h2>
              <ExpenseChart expenses={expenses} />
            </div>

            {/* Recent Activity Section */}
            <div className="card animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0 }}>🕒 Recent Activity</h2>
                <button 
                  className="btn-secondary" 
                  style={{ padding: "8px 16px", fontSize: "12px", borderRadius: "20px" }}
                  onClick={() => setActiveTab("expenses")}
                >
                  View All
                </button>
              </div>
              <div className="expense-list">
                {expenses.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>No recent transactions.</p>
                ) : (
                  [...expenses].reverse().slice(0, 5).map((exp, i) => (
                    <div key={i} className="expense-item">
                      <div className="expense-info">
                        <div className={`category-badge cat-${exp.category.toLowerCase()}`} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px" }}>
                          {exp.category[0]}
                        </div>
                        <div>
                          <p className="expense-name">{exp.name}</p>
                          <p className="expense-date">{new Date(exp.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="expense-amount">
                        {currency}{exp.amount}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="content-area">
              <Budget
                budget={budget}
                setBudget={setBudget}
                expenses={expenses}
                currency={currency}
              />
              <Expense
                expenses={expenses}
                setExpenses={setExpenses}
                currency={currency}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>💰 MoneyLoop</h2>
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Main */}
      <div className="main-content" ref={contentRef}>
        {/* Header */}
        <div className="header animate-fade-up">
          <h1>
            {activeTab === "dashboard"
              ? `Welcome back, ${settings.username} 👋`
              : tabs.find((t) => t.id === activeTab)?.label || ""}
          </h1>

          <div className="header-actions" data-html2canvas-ignore="true">
            <button className="download-excel" onClick={downloadExcel} id="download-excel-btn">
              📊 Download Report
            </button>
            <ThemeToggle />
            <button
              className="logout"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
      <Chatbot budget={budget} expenses={expenses} goals={goals} settings={settings} />
    </div>
  );
}

export default Dashboard;
