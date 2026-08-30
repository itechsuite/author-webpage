/**
 * Usage: npm run clear:transactional-data
 * One-off production reset: wipes test orders, customers, and contact
 * threads accumulated during development/testing, ahead of handoff.
 * Deliberately leaves books, admins, blog posts, categories, social links,
 * and site settings untouched.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const COLLECTIONS = ["orders", "customers", "contact_threads"];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");

  for (const name of COLLECTIONS) {
    const res = await db.collection(name).deleteMany({});
    console.log(`Cleared "${name}": ${res.deletedCount} document(s) removed.`);
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
