/**
 * Usage: npm run update:full-book-covers
 * Sets `fullBookCoverUrl` (the complete, uncropped front+spine+back wrap
 * cover) on existing book records. Images were extracted at 400 DPI from
 * "LOVE COVER.pdf 1 (1).pdf" (each page holds two full wrap covers stacked
 * top/bottom) and uploaded to R2 via `npm run upload:r2`.
 * Matches by slug; only sets `fullBookCoverUrl` + `updatedAt`.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const fullBookCoverUrls: Record<string, string> = {
  "it-is-all-about-love":
    "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783305483424-its-all-about-love-full-cover.jpg",
  "on-the-trail-to-freedom":
    "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783305486265-on-the-trail-to-freedom-full-cover.jpg",
  "ganas-moonlight-tales":
    "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783305488884-ganas-moonlight-tales-full-cover.jpg",
  "the-eyes-of-aisha":
    "https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783305493803-the-eyes-of-aisha-full-cover.jpg",
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");
  const now = new Date();

  for (const [slug, fullBookCoverUrl] of Object.entries(fullBookCoverUrls)) {
    const res = await db
      .collection("books")
      .updateOne({ slug }, { $set: { fullBookCoverUrl, updatedAt: now } });

    if (res.matchedCount === 0) {
      console.warn(`No book found with slug "${slug}" — skipped.`);
    } else {
      console.log(`Set fullBookCoverUrl for "${slug}".`);
    }
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
