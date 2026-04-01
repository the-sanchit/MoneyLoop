try {
  require("express");
  require("cors");
  require("bcryptjs");
  require("jsonwebtoken");
  require("dotenv");
  require("@google/generative-ai");
  console.log("All dependencies are present");
} catch (e) {
  console.error("Missing dependency:", e.message);
  process.exit(1);
}
