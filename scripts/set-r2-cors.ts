/**
 * Usage: npm run set:r2-cors
 * Configures CORS on the R2 bucket so the browser can PUT directly to it
 * using presigned URLs from /api/upload (admin cover/blog image uploads).
 * Safe to re-run — replaces the bucket's CORS policy each time.
 */
import "dotenv/config";
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";

async function main() {
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

  const allowedOrigins = [
    "https://author-webpage-inky.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ];

  await r2.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: allowedOrigins,
            AllowedMethods: ["GET", "PUT", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })
  );

  console.log(`R2 CORS policy set on "${bucket}" for:\n- ${allowedOrigins.join("\n- ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
