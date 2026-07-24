/**
 * Usage: npm run set:test-price -- <slug> <price>
 * Temporarily overrides a single book's price for a live end-to-end
 * payment test. Revert with the flat $5 price afterward via
 * `npm run set:flat-price` (or re-run this with 5).
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

async function main() {
  const slug = process.argv[2];
  const price = Number(process.argv[3]);
  if (!slug || Number.isNaN(price)) {
    console.error("Usage: npm run set:test-price -- <slug> <price>");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");

  const res = await db
    .collection("books")
    .updateOne({ slug }, { $set: { price, currency: "USD", updatedAt: new Date() } });

  console.log(
    res.matchedCount === 0
      ? `No book found with slug "${slug}".`
      : `Set "${slug}" price to $${price} USD.`
  );

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
