const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_FILE = path.join(__dirname, "../../data/db.json");

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    return { users: [] };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const LocalUser = {
  async findOne({ email }) {
    const db = readDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    return {
      ...user,
      _id: user.id,
      save: async function () {
        const db = readDb();
        const index = db.users.findIndex((u) => u.id === this.id);
        if (index !== -1) {
          db.users[index] = {
            id: this.id,
            email: this.email,
            passwordHash: this.passwordHash,
            data: this.data,
          };
          writeDb(db);
        }
      },
    };
  },

  async findById(id) {
    const db = readDb();
    const user = db.users.find((u) => u.id === id || u._id === id);
    if (!user) return null;
    return {
      ...user,
      _id: user.id,
      save: async function () {
        const db = readDb();
        const index = db.users.findIndex((u) => u.id === this.id);
        if (index !== -1) {
          db.users[index] = {
            id: this.id,
            email: this.email,
            passwordHash: this.passwordHash,
            data: this.data,
          };
          writeDb(db);
        }
      },
    };
  },

  async create(userData) {
    const db = readDb();
    const newUser = {
      id: Date.now().toString(),
      ...userData,
    };
    db.users.push(newUser);
    writeDb(db);
    return {
      ...newUser,
      _id: newUser.id,
    };
  },
};

module.exports = LocalUser;
