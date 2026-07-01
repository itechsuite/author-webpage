/**
 * Usage: npm run migrate:ngn
 * One-off migration: converts existing books priced in USD to NGN,
 * using a ~₦1,600/$1 rate, rounded to the nearest 100.
 * Safe to re-run — only touches books whose currency is still "USD".
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const USD_TO_NGN_RATE = 1600;

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");

  const usdBooks = await db.collection("books").find({ currency: "USD" }).toArray();

  for (const book of usdBooks) {
    const price = Math.round((book.price * USD_TO_NGN_RATE) / 100) * 100;
    await db.collection("books").updateOne(
      { _id: book._id },
      { $set: { price, currency: "NGN", updatedAt: new Date() } }
    );
    console.log(`${book.title}: $${book.price} -> NGN ${price}`);
  }

  console.log(`Migrated ${usdBooks.length} book(s) from USD to NGN.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
