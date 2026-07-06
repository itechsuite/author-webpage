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
  fileUrl?: string; // protected download asset in R2 (delivered after purchase)
  genre?: string;
  tags?: string[];
  language?: string;
  isbn?: string;
  pageCount?: number;
  publishedDate?: string; // original publication date, distinct from createdAt
  published: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookInput = Omit<Book, "_id" | "createdAt" | "updatedAt" | "slug"> & {
  slug?: string;
};
