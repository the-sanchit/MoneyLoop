import React, { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

const CATEGORY_CLASS = {
  Food: "cat-food",
  Transport: "cat-transport",
  Shopping: "cat-shopping",
  Bills: "cat-bills",
  Entertainment: "cat-entertainment",
  Health: "cat-health",
  Other: "cat-other",
};

function Expense({ expenses, setExpenses, currency = "₹" }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [editIndex, setEditIndex] = useState(null);

  const saveExpense = () => {
    if (!name || !amount) return;

    if (editIndex !== null) {
      const updatedExpenses = [...expenses];
      updatedExpenses[editIndex] = {
        ...updatedExpenses[editIndex],
        name,
        amount: Number(amount),
        category,
      };
      setExpenses(updatedExpenses);
      setEditIndex(null);
    } else {
      const newExpense = {
        name,
        amount: Number(amount),
        category,
        date: new Date().toISOString(),
      };
      setExpenses([...expenses, newExpense]);
    }

    setName("");
    setAmount("");
    setCategory("Other");
  };

  const startEdit = (index) => {
    const expense = expenses[index];
    setName(expense.name);
    setAmount(expense.amount);
    setCategory(expense.category || "Other");
    setEditIndex(index);
  };

  const deleteExpense = (index) => {
    const updated = expenses.filter((_, i) => i !== index);
    setExpenses(updated);
  };

  return (
    <div className="card">
      <h2>Expense Tracking</h2>

      <div className="card-form">
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={saveExpense}>
          {editIndex !== null ? "Update Expense" : "Add Expense"}
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>No expenses added yet. Start tracking your spending!</p>
        </div>
      ) : (
        <ul className="expense-list">
          {expenses.map((item, index) => (
            <li key={index} className="expense-item">
              <div className="expense-info">
                <div>
                  <div className="expense-name">{item.name}</div>
                  <div className="expense-date">
                    {item.date ? new Date(item.date).toLocaleDateString() : ""}
                  </div>
                </div>
                <span className={`category-badge ${CATEGORY_CLASS[item.category] || "cat-other"}`}>
                  {item.category || "Other"}
                </span>
              </div>
              <div className="expense-right">
                <span className="expense-amount">{currency}{item.amount}</span>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button style={{ cursor: "pointer", border: "none", background: "transparent", fontSize: "16px" }} onClick={() => startEdit(index)}>✏️</button>
                  <button className="delete" onClick={() => deleteExpense(index)}>✕</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Expense;
