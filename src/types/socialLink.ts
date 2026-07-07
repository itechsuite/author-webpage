export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "twitter"
  | "facebook"
  | "tiktok"
  | "pinterest"
  | "linkedin"
  | "other";

export interface SocialLink {
  _id?: string;
  platform: SocialPlatform;
  label?: string; // custom display name, mainly used when platform === "other"
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type SocialLinkInput = Omit<SocialLink, "_id" | "createdAt" | "updatedAt">;
