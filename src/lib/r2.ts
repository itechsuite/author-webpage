import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 speaks the S3 API, so the AWS SDK works against it directly
// once you point it at the R2 account endpoint.
export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "";
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL || "";

/**
 * Generates a short-lived signed URL the browser can PUT the file to
 * directly, so large covers/videos never pass through our server.
 */
export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 }); // 5 min
  const publicUrl = `${PUBLIC_BASE_URL}/${key}`;
  return { uploadUrl, publicUrl, key };
}

export async function deleteObject(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Generates a short-lived signed URL to read a private/deliverable asset,
 * e.g. a purchased ebook file, without exposing the permanent public URL.
 */
export async function getPresignedDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(r2, command, { expiresIn });
}

/** Recovers the R2 object key from a full public URL produced by getPresignedUploadUrl. */
export function keyFromPublicUrl(publicUrl: string): string {
  return publicUrl.replace(`${PUBLIC_BASE_URL}/`, "");
}

/** Builds a namespaced object key, e.g. covers/1699999-my-book.jpg */
export function buildObjectKey(
  folder: "covers" | "previews" | "files" | "blog" | "secure",
  filename: string
) {
  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase();
  return `${folder}/${Date.now()}-${safeName}`;
}
