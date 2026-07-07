/**
 * Usage: npm run migrate:admin-roles
 * One-off: sets role="super_admin", active=true on any admin document that
 * predates the RBAC system (missing a `role` field). Safe to re-run.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");

  const res = await db.collection("admins").updateMany(
    { role: { $exists: false } },
    { $set: { role: "super_admin", active: true } }
  );

  console.log(`Migrated ${res.modifiedCount} admin account(s) to role "super_admin".`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
