export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type CategoryInput = Omit<Category, "_id" | "createdAt" | "updatedAt" | "slug"> & {
  slug?: string;
};
