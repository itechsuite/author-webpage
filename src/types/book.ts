export interface Book {
  _id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  coverImageUrl: string;
  images?: string[]; // additional gallery images (back cover, sample spreads, etc.)
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
