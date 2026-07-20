/**
 * Usage: npm run set:coming-soon
 * Marks "It Is All About Love" and "Gana's Moonlight Tales" as Coming Soon —
 * still visible on the site, but not purchasable — until the author uploads
 * their final files. Leaves "The Eyes of Aisha" and "On the Trail to
 * Freedom" untouched (fully published/purchasable).
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const slugs = ["it-is-all-about-love", "ganas-moonlight-tales"];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");
  const now = new Date();

  for (const slug of slugs) {
    const res = await db
      .collection("books")
      .updateOne({ slug }, { $set: { comingSoon: true, updatedAt: now } });
    console.log(
      res.matchedCount === 0
        ? `No book found with slug "${slug}" — skipped.`
        : `Marked "${slug}" as Coming Soon.`
    );
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
