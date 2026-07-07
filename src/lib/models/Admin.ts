import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { AdminAccount, Role } from "@/types/admin";

const COLLECTION = "admins";

function serialize(doc: any): AdminAccount {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

export async function getAdminByEmail(email: string) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne({ email: email.toLowerCase() });
}

export async function listAdmins(): Promise<AdminAccount[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ createdAt: 1 }).toArray();
  return docs.map(serialize);
}

/**
 * Used by scripts/seed-admin.ts to bootstrap the very first account, which
 * must be a super_admin so it can create the rest of the team.
 */
export async function upsertAdmin(email: string, password: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).createIndex({ email: 1 }, { unique: true });

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();

  await db.collection(COLLECTION).updateOne(
    { email: email.toLowerCase() },
    {
      $set: { email: email.toLowerCase(), passwordHash, updatedAt: now },
      $setOnInsert: { createdAt: now, role: "super_admin", active: true },
    },
    { upsert: true }
  );
}

export async function createAdmin(email: string, password: string, role: Role): Promise<AdminAccount> {
  const db = await getDb();
  await db.collection(COLLECTION).createIndex({ email: 1 }, { unique: true });

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();
  const doc = {
    email: email.toLowerCase(),
    passwordHash,
    role,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COLLECTION).insertOne(doc);
  return serialize({ ...doc, _id: result.insertedId });
}

export async function updateAdminRole(id: string, role: Role): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { role, updatedAt: new Date() } }
  );
}

export async function setAdminActive(id: string, active: boolean): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { active, updatedAt: new Date() } }
  );
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<{ ok: boolean; role?: Role }> {
  const admin = await getAdminByEmail(email);
  if (!admin || admin.active === false) return { ok: false };
  const ok = await bcrypt.compare(password, admin.passwordHash);
  return ok ? { ok: true, role: admin.role || "super_admin" } : { ok: false };
}
