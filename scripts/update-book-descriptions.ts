/**
 * Usage: npm run update:book-descriptions
 * Syncs the `description` field on existing book records in the database
 * with the author's finalized summaries (see CLIENT_SPEC.md, Section 6).
 * Only updates `description` — leaves cover images, price, etc. untouched.
 * Matches by slug; logs a warning if a slug isn't found rather than creating one.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const descriptions: Record<string, string> = {
  "the-eyes-of-aisha":
    "Aisha, a young girl with lofty dreams, is forced into marriage, and her desire for education is shattered. She suffers a life-altering ailment during childbirth, which sends her to a long stay in the hospital. While there, she makes friends with Eka, and through chance and technology, they get connected with another young girl on another continent who sets events in motion that help them overcome their health challenges and change the trajectory of their lives.",
  "on-the-trail-to-freedom":
    "Agana is a promising young man whose future is threatened by the greed of his relatives. After the death of his father, he became a target for the men who plot to eliminate him. He is accused of manslaughter and is to be killed as an appeasement to the gods. He will find out if his 'Chi' will save him from his haters.\n\nThe novel is set in 19th-century Igboland and explores the customs and traditions that shaped the characters' daily lives and how some of the finer aspects of these traditions influence the worldview of succeeding generations.",
  "it-is-all-about-love":
    "It's All About Love is an expository of God's golden rule on love. We are created to have fellowship with God and with one another. The whole of scripture is based on love; God's love towards us and the admonition to us to love God with our whole heart and to love one another. When we love God, we serve him unreservedly, and when we love one another, we demonstrate that we are true disciples of Jesus Christ.\n\nThe love notes included in the book are scriptural reminders to strengthen our faith and to focus on the things that are important in our Christian walk.",
  "ganas-moonlight-tales":
    "Gana is an old man who lives in the city with his son. During warm summer nights, his grandchildren, and other children in the neighborhood gather around him to listen to his stories about his childhood, and other folk tales. His stories are full of songs and dance.\n\nThis is an interesting read for children and young adults who want to learn about Igbo folklore and traditions.",
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");
  const now = new Date();

  for (const [slug, description] of Object.entries(descriptions)) {
    const res = await db
      .collection("books")
      .updateOne({ slug }, { $set: { description, updatedAt: now } });

    if (res.matchedCount === 0) {
      console.warn(`No book found with slug "${slug}" — skipped.`);
    } else {
      console.log(`Updated description for "${slug}".`);
    }
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
