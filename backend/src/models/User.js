const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: "Other" },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const goalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    targetAmount: { type: Number, default: 0 },
    savedAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    data: {
      budget: { type: Number, default: 0 },
      expenses: [expenseSchema],
      goals: [goalSchema],
      settings: {
        username: { type: String, default: "Admin" },
        currency: { type: String, default: "₹" },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
