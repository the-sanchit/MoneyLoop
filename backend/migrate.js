/**
 * Migration script: db.json → MongoDB Atlas
 * Copies all existing users from the local JSON file into MongoDB.
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const User = require("./src/models/User");

const DB_FILE = path.join(__dirname, "data", "db.json");

async function migrate() {
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB Atlas\n");

    const raw = fs.readFileSync(DB_FILE, "utf8");
    const db = JSON.parse(raw);

    console.log(`Found ${db.users.length} users in db.json\n`);

    let migrated = 0;
    let skipped = 0;

    for (const user of db.users) {
      const existing = await User.findOne({ email: user.email.toLowerCase() });
      if (existing) {
        console.log(`⏭️  Skipped (already exists): ${user.email}`);
        skipped++;
        continue;
      }

      await User.create({
        email: user.email,
        passwordHash: user.passwordHash,
        data: {
          budget: user.data?.budget || 0,
          expenses: user.data?.expenses || [],
          goals: user.data?.goals || [],
          settings: user.data?.settings || {
            username: user.email.split("@")[0],
            currency: "₹",
          },
        },
      });

      console.log(`✅ Migrated: ${user.email}`);
      migrated++;
    }

    console.log(`\n--- Migration Complete ---`);
    console.log(`Migrated: ${migrated} | Skipped: ${skipped} | Total: ${db.users.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err.message);
    process.exit(1);
  }
}

migrate();
