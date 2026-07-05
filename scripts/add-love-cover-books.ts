/**
 * Usage: npm run add:love-cover-books
 * Inserts the three books extracted from "LOVE COVER.pdf":
 *   - It Is All About Love
 *   - Gana's Moonlight Tales
 *   - The Eyes of Aisha
 * Safe to re-run — upserts by slug, so no duplicates are created.
 *
 * Cover images were extracted from the print-cover PDF at 600 DPI,
 * cropped to the front-cover panel, and uploaded to R2 via `npm run upload:r2`.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const books = [
  {
    title: "It Is All About Love",
    slug: "it-is-all-about-love",
    subtitle: "An expository of God's golden rule on love",
    description:
      "It's All About Love is an expository of God's golden rule on love in the Bible. We are created to have fellowship with God and with one another, which is defined by love. The whole of scripture is based on love — God's love towards us and the admonition for us to love God with our whole heart and to love each other. When we love God we serve Him unreservedly, and when we love one another we demonstrate that we are true disciples of Jesus Christ. The love notes included in this book are scriptural reminders to strengthen our faith and to focus on the things that are important in our Christian walk.",
    coverImageUrl:
      "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783128888316-its-all-about-love-front.jpg",
    images: [
      "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783128939141-its-all-about-love-wrap.jpg",
    ] as string[],
    previewVideoUrl: "",
    price: 20000,
    currency: "NGN",
    format: "ebook" as const,
    fileUrl: "",
    genre: "Christian Living",
    tags: ["Christian living", "faith", "devotional", "scripture", "love"],
    language: "English",
    publisher: "Royal Castle Publishing",
    published: true,
    featured: false,
  },
  {
    title: "Gana's Moonlight Tales",
    slug: "ganas-moonlight-tales",
    subtitle: "Folktales for children and young adults",
    description:
      "Gana is an old man who lives with his son and his family in the city. During warm summer nights his grandchildren and other children gather around him to listen to stories from his childhood and other folktales. His stories are full of songs and lyrics. This is an interesting read for children and young adults who want to learn more about Igbo traditions and folktales.",
    coverImageUrl:
      "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783128892866-ganas-moonlight-tales-front.jpg",
    images: [
      "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783128943205-ganas-moonlight-tales-wrap.jpg",
    ] as string[],
    previewVideoUrl: "",
    price: 20000,
    currency: "NGN",
    format: "ebook" as const,
    fileUrl: "",
    genre: "Children's Fiction",
    tags: ["folktales", "children", "young adult", "Igbo tradition"],
    language: "English",
    publisher: "Royal Castle Publishing",
    published: true,
    featured: false,
  },
  {
    title: "The Eyes of Aisha",
    slug: "the-eyes-of-aisha",
    subtitle: "A story of resilience, friendship, and hope",
    description:
      "Aisha, a young girl with lofty dreams, is forced to marry a man older than her father, and her desire for education is shattered. She experiences a life-altering ailment during childbirth which sends her to a long stay in the hospital. At the hospital she makes friends with Eka, and through chance and technology they get connected to another girl on another continent who sets in motion events that help them overcome their health challenges and change the trajectory of their lives.",
    coverImageUrl:
      "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783128899350-eyes-of-aisha-front.jpg",
    images: [
      "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783128949929-eyes-of-aisha-wrap.jpg",
    ] as string[],
    previewVideoUrl: "",
    price: 20000,
    currency: "NGN",
    format: "ebook" as const,
    fileUrl: "",
    genre: "Literary Fiction",
    tags: ["literary fiction", "resilience", "friendship", "women"],
    language: "English",
    publisher: "Royal Castle Publishing",
    published: true,
    featured: false,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");
  const now = new Date();

  for (const book of books) {
    const res = await db.collection("books").updateOne(
      { slug: book.slug },
      { $set: { ...book, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
    console.log(
      res.upsertedCount ? `Inserted "${book.title}".` : `Updated existing "${book.title}".`
    );
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
