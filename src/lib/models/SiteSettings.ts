import { getDb } from "@/lib/mongodb";
import type { SiteSettings } from "@/types/siteSettings";

const COLLECTION = "site_settings";
const DOC_ID = "singleton";

const DEFAULTS: SiteSettings = {
  socialLinksVisible: false,
  updatedAt: new Date(0).toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: DOC_ID } as any);
  if (!doc) return DEFAULTS;
  return {
    socialLinksVisible: doc.socialLinksVisible ?? false,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

export async function updateSiteSettings(
  input: Partial<Omit<SiteSettings, "updatedAt">>
): Promise<SiteSettings> {
  const db = await getDb();
  const now = new Date();
  await db.collection(COLLECTION).updateOne(
    { _id: DOC_ID } as any,
    { $set: { ...input, updatedAt: now } },
    { upsert: true }
  );
  return getSiteSettings();
}
