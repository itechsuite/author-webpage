/**
 * Usage: npm run upload:r2 -- <local-file-path> [covers|previews|files]
 * Uploads a local file to the R2 bucket and prints the public URL.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const EXT_TO_TYPE: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  pdf: "application/pdf",
  epub: "application/epub+zip",
};

async function main() {
  const filePath = process.argv[2];
  const folder = (process.argv[3] || "covers") as "covers" | "previews" | "files";
  if (!filePath) {
    console.error("Usage: npm run upload:r2 -- <local-file-path> [covers|previews|files]");
    process.exit(1);
  }

  const bucket = process.env.R2_BUCKET_NAME;
  const publicBase = process.env.R2_PUBLIC_BASE_URL;
  if (!bucket || !publicBase) throw new Error("Missing R2_BUCKET_NAME or R2_PUBLIC_BASE_URL");

  const body = readFileSync(filePath);
  const ext = filePath.split(".").pop()!.toLowerCase();
  const contentType = EXT_TO_TYPE[ext] || "application/octet-stream";

  const safeName = basename(filePath).replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase();
  const key = `${folder}/${Date.now()}-${safeName}`;

  const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
  });

  await r2.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
  );

  const publicUrl = `${publicBase.replace(/\/$/, "")}/${key}`;
  console.log(publicUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
