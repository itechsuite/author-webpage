import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "admins";

export interface Admin {
  _id?: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const db = await getDb();
  return db.collection<Admin>(COLLECTION).findOne({ email: email.toLowerCase() });
}

export async function upsertAdmin(email: string, password: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).createIndex({ email: 1 }, { unique: true });

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();

  await db.collection(COLLECTION).updateOne(
    { email: email.toLowerCase() },
    { $set: { email: email.toLowerCase(), passwordHash, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true }
  );
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const admin = await getAdminByEmail(email);
  if (!admin) return false;
  return bcrypt.compare(password, admin.passwordHash);
}
