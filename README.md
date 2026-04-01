# Budget Planner 💰

A full-featured Budget Planner application designed to help you track expenses, manage budgets, and achieve financial goals, equipped with an AI-powered Financial Advisor.

## Features
- **Budget Management**: Set and track your overall budget.
- **Expense Tracking**: Log individual expenses and categorize them.
- **Financial Goals**: Set financial goals and monitor your progress.
- **AI Financial Advisor**: Ask customized questions about your spending habits, built using Google's Gemini AI.
- **Interactive Reports**: Visual representation of your financial data.
- **Light/Dark Mode**: Personalize your viewing experience.

## Tech Stack
- **Frontend**: React.js, React Router, Chart.js
- **Backend**: Node.js, Express.js
- **Data Storage**: Local JSON-based Database (for simplicity)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

## Prerequisites
- Node.js (v18+ recommended)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

## Setup Instructions

1. **Install dependencies**
   Install frontend and backend packages:
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

2. **Configure Environment Variables**
   In the `backend` directory, create a `.env` file based on the provided `.env.example`:
   ```bash
   PORT=5000
   JWT_SECRET=your_super_secret_key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the Application**
   Start both the frontend and backend servers together using a single command from the project root:
   ```bash
   npm start
   ```

   You can also use:
   ```bash
   npm run dev
   ```

   - Frontend will run on [http://localhost:3000](http://localhost:3000)
   - Backend API will be available at [http://localhost:5000](http://localhost:5000)
