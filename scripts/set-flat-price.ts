/**
 * Usage: npm run set:flat-price
 * Enforces a flat $5 USD price across every book in the catalog.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");
  const now = new Date();

  const res = await db.collection("books").updateMany(
    {},
    { $set: { price: 5, currency: "USD", updatedAt: now } }
  );

  console.log(`Set flat $5 USD price on ${res.modifiedCount} book(s).`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
