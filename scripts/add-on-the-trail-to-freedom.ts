/**
 * Usage: npm run add:trail
 * Inserts the book "On the Trail to Freedom" (Ihuoma Iroaganachi).
 * Safe to re-run — updates the existing record if the slug already exists.
 *
 * Cover image was uploaded to R2 via `npm run upload:r2` and its public
 * URL is set as coverImageUrl below.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const book = {
  title: "On the Trail to Freedom",
  slug: "on-the-trail-to-freedom",
  subtitle: "A novel of 19th-century Igboland",
  description:
    "The novel is set in 19th-century Igboland and explores the customs and traditions that shaped the characters' daily lives. It shows how the finer aspects of these traditions influence the worldview of succeeding generations. If you love stories about trials and triumphs, you will love this novel.",
  // Front-cover crop (displays cleanly as a 2:3 portrait on the storefront).
  coverImageUrl:
    "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783007567255-on-the-trail-to-freedom-front.jpg",
  // Full wrap (back + spine + front) kept in the gallery.
  images: [
    "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783006389275-on-the-trail-to-freedom.jpg",
  ] as string[],
  previewVideoUrl: "",
  price: 20000, // ₦20,000
  currency: "NGN",
  format: "ebook" as const,
  fileUrl: "",
  genre: "Historical Fiction",
  tags: ["historical fiction", "Igboland", "19th century", "Nigeria", "tradition"],
  language: "English",
  isbn: "978-978-8415-04-6",
  publisher: "Royal Castle Publishing",
  published: true,
  featured: true,
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");
  const now = new Date();

  const res = await db.collection("books").updateOne(
    { slug: book.slug },
    { $set: { ...book, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true }
  );

  console.log(
    res.upsertedCount ? `Inserted "${book.title}".` : `Updated existing "${book.title}".`
  );
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
