import React, { useState } from "react";

function Goals({ goals, setGoals, currency = "₹" }) {
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [savingsInputs, setSavingsInputs] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const saveGoal = () => {
    if (!goalName || !goalAmount) return;

    if (editIndex !== null) {
      const updated = goals.map((goal, i) => {
        if (i === editIndex) {
          return { ...goal, name: goalName, amount: Number(goalAmount) };
        }
        return goal;
      });
      setGoals(updated);
      setEditIndex(null);
    } else {
      const newGoal = {
        name: goalName,
        amount: Number(goalAmount),
        saved: 0,
      };
      setGoals([...goals, newGoal]);
    }

    setGoalName("");
    setGoalAmount("");
  };

  const startEdit = (index) => {
    const goal = goals[index];
    setGoalName(goal.name);
    setGoalAmount(goal.amount);
    setEditIndex(index);
  };

  const addSavings = (index) => {
    const addAmount = Number(savingsInputs[index]) || 0;
    if (addAmount <= 0) return;

    const updated = goals.map((goal, i) => {
      if (i === index) {
        return { ...goal, saved: (goal.saved || 0) + addAmount };
      }
      return goal;
    });

    setGoals(updated);
    setSavingsInputs({ ...savingsInputs, [index]: "" });
  };

  const deleteGoal = (index) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
  };

  return (
    <div className="card">
      <h2>🎯 Goal Setting</h2>

      <div className="card-form">
        <input
          type="text"
          placeholder="Goal Name (e.g. Emergency Fund)"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
        />
        <button onClick={saveGoal}>
          {editIndex !== null ? "Update Goal" : "Add Goal"}
        </button>
        {editIndex !== null && (
          <button 
            className="delete" 
            onClick={() => {
              setEditIndex(null);
              setGoalName("");
              setGoalAmount("");
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <p>No goals set yet. Start planning your financial goals!</p>
        </div>
      ) : (
        goals.map((goal, index) => {
          const saved = goal.saved || 0;
          const percentage = Math.min(Math.round((saved / goal.amount) * 100), 100);
          const isComplete = percentage >= 100;

          return (
            <div key={index} className="goal-item">
              <div className="goal-header">
                <span className="goal-name">
                  {isComplete ? "✅ " : ""}{goal.name}
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="edit-btn" onClick={() => startEdit(index)}>✏️</button>
                  <button className="delete" onClick={() => deleteGoal(index)}>✕</button>
                </div>
              </div>

              <div className="goal-amounts">
                Saved: <span>{currency}{saved}</span> / {currency}{goal.amount}
              </div>

              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${percentage}%`,
                    background: isComplete
                      ? "linear-gradient(90deg, #22c55e, #4ade80)"
                      : "linear-gradient(90deg, #7c3aed, #a78bfa)",
                  }}
                />
              </div>

              <div className="goal-footer">
                <span className="goal-percentage">{percentage}% Complete</span>
                {!isComplete && (
                  <div className="goal-actions">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={savingsInputs[index] || ""}
                      onChange={(e) =>
                        setSavingsInputs({ ...savingsInputs, [index]: e.target.value })
                      }
                    />
                    <button className="btn-save" onClick={() => addSavings(index)}>
                      + Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Goals;
