export interface ExternalSource {
  source: string; // retailer/platform name, e.g. "Amazon", "Barnes & Noble"
  link: string;
}

export interface Book {
  _id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  coverImageUrl: string;
  fullBookCoverUrl?: string; // complete, uncropped wrap cover (front + spine + back)
  images?: string[]; // additional gallery images (back cover, sample spreads, etc.)
  externalSources?: ExternalSource[]; // other platforms where this book is available
  previewVideoUrl?: string; // optional video cover / book trailer
  price: number; // in smallest currency unit-agnostic decimal, e.g. 14.99
  currency: string; // "USD"
  format: "ebook" | "audiobook" | "bundle";
  bookFileKey?: string; // raw R2 object key for the deliverable file — admin-only, never returned to public API/pages
  genre?: string;
  tags?: string[];
  language?: string;
  isbn?: string;
  pageCount?: number;
  publishedDate?: string; // original publication date, distinct from createdAt
  published: boolean;
  featured?: boolean;
  comingSoon?: boolean; // still shown on the site, but purchase is disabled with a "Coming Soon" label
  createdAt: string;
  updatedAt: string;
}

export type BookInput = Omit<Book, "_id" | "createdAt" | "updatedAt" | "slug"> & {
  slug?: string;
};
