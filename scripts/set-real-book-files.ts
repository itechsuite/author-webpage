/**
 * Usage: npm run set:real-book-files
 * Replaces the dummy placeholder PDF (bookFileKey) with the author's real
 * manuscript files for the two currently-published, purchasable books.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const updates: Record<string, string> = {
  "the-eyes-of-aisha": "secure/1784507535631-the_eyes_of_aisha_024457.pdf",
  "on-the-trail-to-freedom": "secure/1784507537941-on_the_trail_to_freedom_024414.pdf",
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");
  const now = new Date();

  for (const [slug, bookFileKey] of Object.entries(updates)) {
    const res = await db
      .collection("books")
      .updateOne({ slug }, { $set: { bookFileKey, updatedAt: now } });
    console.log(
      res.matchedCount === 0
        ? `No book found with slug "${slug}" — skipped.`
        : `Set real file for "${slug}".`
    );
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
