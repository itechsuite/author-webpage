/**
 * Usage: npm run seed:admin -- "admin@example.com" "your-password"
 * Upserts the admin login into the `admins` collection in MongoDB.
 * Falls back to ADMIN_EMAIL from .env if no email arg is given.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- "admin@example.com" "your-password"');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");

  await db.collection("admins").createIndex({ email: 1 }, { unique: true });

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();

  await db.collection("admins").updateOne(
    { email: email.toLowerCase() },
    {
      $set: { email: email.toLowerCase(), passwordHash, updatedAt: now },
      $setOnInsert: { createdAt: now, role: "super_admin", active: true },
    },
    { upsert: true }
  );

  console.log(`Admin login seeded for ${email.toLowerCase()}.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
