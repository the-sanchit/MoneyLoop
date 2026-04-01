const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("./authMiddleware");
const connectDB = require("./db");
const User = require("./models/User");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "moneyloop_unsecure_fallback_secret_123";

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is not defined in .env! Using insecure fallback.");
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// ─── Auth: Signup ───────────────────────────────────────────────
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Account already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      passwordHash,
      data: {
        budget: 0,
        expenses: [],
        goals: [],
        settings: {
          username: email.split("@")[0] || "Admin",
          currency: "₹",
        },
      },
    });

    const token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: { id: newUser._id.toString(), email: newUser.email },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error during signup" });
  }
});

// ─── Auth: Login ────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user._id.toString(), email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error during login" });
  }
});

// ─── Data: Get ──────────────────────────────────────────────────
app.get("/api/data", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(
    user.data || {
      budget: 0,
      expenses: [],
      goals: [],
      settings: { username: user.email.split("@")[0], currency: "₹" },
    }
  );
});

// ─── Data: Update ───────────────────────────────────────────────
app.put("/api/data", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { budget, expenses, goals, settings } = req.body;

  user.data = {
    budget: Number.isFinite(budget) ? budget : 0,
    expenses: Array.isArray(expenses) ? expenses : [],
    goals: Array.isArray(goals) ? goals : [],
    settings:
      settings && typeof settings === "object"
        ? {
            username: settings.username || user.email.split("@")[0] || "Admin",
            currency: settings.currency || "₹",
          }
        : { username: user.email.split("@")[0] || "Admin", currency: "₹" },
  };

  await user.save();
  return res.json({ message: "Data saved" });
});

// ─── Data: Clear ────────────────────────────────────────────────
app.delete("/api/data", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.data = {
    budget: 0,
    expenses: [],
    goals: [],
    settings: {
      username: user.email.split("@")[0] || "Admin",
      currency: "₹",
    },
  };

  await user.save();
  return res.json({ message: "Data cleared" });
});

// ─── AI Chat ────────────────────────────────────────────────────
app.post("/api/chat", authMiddleware, async (req, res) => {
  const { message, history, data } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    const userMsg = (history ? history[history.length - 1].text : message).toLowerCase();
    let reply = "";

    if (/(hi|hello|hey|greetings|morning|afternoon|evening)/.test(userMsg)) {
      reply = `Hello! I am your AI Financial Advisor. How can I assist you with your finances today?`;
    } else if (userMsg.includes("budget") || userMsg.includes("balance") || userMsg.includes("money")) {
      reply = `Your currently allocated budget is **${data?.settings?.currency || "$"}${data?.budget || 0}**. Let me know if you need advice on how to distribute this!`;
    } else if (userMsg.includes("expense") || userMsg.includes("spent") || userMsg.includes("spending")) {
      const expenseCount = Array.isArray(data?.expenses) ? data.expenses.length : 0;
      const totalSpent = Array.isArray(data?.expenses)
        ? data.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
        : 0;
      reply = `You have recorded **${expenseCount} expenses**, totaling **${data?.settings?.currency || "$"}${totalSpent}**. Would you like me to analyze your spending trends?`;
    } else if (userMsg.includes("goal") || userMsg.includes("save") || userMsg.includes("saving")) {
      const goalCount = Array.isArray(data?.goals) ? data.goals.length : 0;
      reply = `You currently have **${goalCount} financial goals**. Staying focused on your targets is the best way to achieve financial independence.`;
    } else {
      reply = `I can certainly help you with that! As your AI financial advisor, I always recommend reviewing your budget and recent expenses first to ensure you're on track. Is there a specific financial category you want me to look into?`;
    }

    return res.json({ text: reply });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chatHistory = (history || []).slice(0, -1).map((msg) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history: chatHistory });
    let userMessage = history ? history[history.length - 1].text : message;

    userMessage = `You are a helpful AI Financial Advisor inside a Budget Planner app. Keep answers very concise, friendly, and formatted in Markdown.

Here is the user's current financial data context:
Budget: ${data?.budget || 0}
Settings: ${JSON.stringify(data?.settings || {})}
Goals: ${JSON.stringify(data?.goals || [])}
Expenses: ${JSON.stringify(data?.expenses || [])}

User's Question: "${userMessage}"`;

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    res.json({ text: responseText });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ text: "Sorry, I had trouble generating a response. Please try again later." });
  }
});

// ─── Start Server ───────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
});
