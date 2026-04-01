const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

const defaultData = {
  users: [],
};

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

function readDb() {
  ensureDbFile();
  const file = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(file);
}

function writeDb(db) {
  ensureDbFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
}

function getDefaultUserData(email) {
  return {
    budget: 0,
    expenses: [],
    goals: [],
    settings: {
      username: email.split("@")[0] || "Admin",
      currency: "₹",
    },
  };
}

module.exports = {
  readDb,
  writeDb,
  getDefaultUserData,
};
