const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "moneyloop_unsecure_fallback_secret_123";
const PORT = process.env.PORT || 5000;

module.exports = {
  JWT_SECRET,
  PORT,
};
