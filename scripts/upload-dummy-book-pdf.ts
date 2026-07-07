/**
 * Usage: npm run upload:dummy-book-pdf
 * Uploads the placeholder "LOVE COVER.pdf" as a stand-in for every book's
 * actual deliverable file, storing only the R2 object key (never a public
 * URL) on each book's `bookFileKey` field. Replace this once real book
 * manuscripts are ready — just re-run npm run upload:r2-style uploads per
 * book and update `bookFileKey` accordingly.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const DUMMY_PDF_PATH = "/home/egoras-4/Downloads/LOVE COVER.pdf 1 (1).pdf";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("Missing R2_BUCKET_NAME");

  const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
  });

  const body = readFileSync(DUMMY_PDF_PATH);
  const key = `secure/${Date.now()}-dummy-book.pdf`;

  await r2.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "application/pdf" })
  );
  console.log(`Uploaded dummy PDF to secure key: ${key}`);

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");
  const now = new Date();

  const res = await db
    .collection("books")
    .updateMany({}, { $set: { bookFileKey: key, updatedAt: now } });

  console.log(`Set bookFileKey on ${res.modifiedCount} book record(s).`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
