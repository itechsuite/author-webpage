/**
 * Usage: npm run seed
 * Inserts sample books so the storefront isn't empty on first run.
 * Replace the coverImageUrl/images/previewVideoUrl values with real R2 URLs
 * once you've uploaded your own assets.
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "author_platform");

  const now = new Date();
  const author = process.env.NEXT_PUBLIC_SITE_NAME || "Ihuoma Iroaganachi";

  const books = [
    {
      title: "The Weight of Silence",
      slug: "the-weight-of-silence",
      subtitle: "A novel about the things we leave unsaid",
      description:
        `${author}'s debut novel follows three generations of a Lagos family as a long-buried secret resurfaces during a homecoming. A meditation on memory, grief, and the cost of staying quiet.`,
      coverImageUrl: "https://picsum.photos/seed/weight-of-silence/600/900",
      images: [
        "https://picsum.photos/seed/weight-of-silence-back/600/900",
        "https://picsum.photos/seed/weight-of-silence-sample1/1000/1400",
        "https://picsum.photos/seed/weight-of-silence-sample2/1000/1400",
      ],
      previewVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      price: 24000,
      currency: "NGN",
      format: "ebook",
      fileUrl: "",
      genre: "Literary Fiction",
      tags: ["family", "Nigeria", "grief", "contemporary"],
      language: "English",
      isbn: "978-1-234567-01-1",
      pageCount: 312,
      publishedDate: "2023-04-11",
      published: true,
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Small Gods of the Marketplace",
      slug: "small-gods-of-the-marketplace",
      subtitle: "Short stories",
      description:
        "A collection of nine short stories set in bustling West African markets, where ordinary vendors, traders, and wanderers brush up against the uncanny.",
      coverImageUrl: "https://picsum.photos/seed/small-gods/600/900",
      images: [
        "https://picsum.photos/seed/small-gods-back/600/900",
        "https://picsum.photos/seed/small-gods-sample1/1000/1400",
      ],
      previewVideoUrl: "",
      price: 16000,
      currency: "NGN",
      format: "ebook",
      fileUrl: "",
      genre: "Short Fiction",
      tags: ["magical realism", "short stories", "West Africa"],
      language: "English",
      isbn: "978-1-234567-02-8",
      pageCount: 214,
      publishedDate: "2022-09-02",
      published: true,
      featured: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Letters I Never Sent",
      slug: "letters-i-never-sent",
      subtitle: "A memoir in fragments",
      description:
        "Told through unsent letters spanning two decades, this memoir traces one woman's path from a small town upbringing to building a life on her own terms.",
      coverImageUrl: "https://picsum.photos/seed/letters-never-sent/600/900",
      images: ["https://picsum.photos/seed/letters-never-sent-back/600/900"],
      previewVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      price: 20000,
      currency: "NGN",
      format: "audiobook",
      fileUrl: "",
      genre: "Memoir",
      tags: ["memoir", "identity", "coming of age"],
      language: "English",
      isbn: "978-1-234567-03-5",
      pageCount: 264,
      publishedDate: "2021-11-19",
      published: true,
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "The Bookkeeper's Daughter",
      slug: "the-bookkeepers-daughter",
      subtitle: "",
      description:
        "When her father's ledger business collapses under mysterious debts, a sharp-witted accountant must untangle a web of fraud that reaches into her own family.",
      coverImageUrl: "https://picsum.photos/seed/bookkeepers-daughter/600/900",
      images: [
        "https://picsum.photos/seed/bookkeepers-daughter-back/600/900",
        "https://picsum.photos/seed/bookkeepers-daughter-sample1/1000/1400",
      ],
      previewVideoUrl: "",
      price: 27000,
      currency: "NGN",
      format: "ebook",
      fileUrl: "",
      genre: "Mystery / Thriller",
      tags: ["mystery", "family drama", "finance"],
      language: "English",
      isbn: "978-1-234567-04-2",
      pageCount: 356,
      publishedDate: "2024-02-06",
      published: true,
      featured: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Bound & Unbound",
      subtitle: "The complete collection",
      slug: "bound-and-unbound",
      description:
        "The bundle collects three of the author's earlier works in one edition, plus a new afterword written exclusively for this release.",
      coverImageUrl: "https://picsum.photos/seed/bound-and-unbound/600/900",
      images: [
        "https://picsum.photos/seed/bound-and-unbound-back/600/900",
        "https://picsum.photos/seed/bound-and-unbound-sample1/1000/1400",
        "https://picsum.photos/seed/bound-and-unbound-sample2/1000/1400",
      ],
      previewVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      price: 48000,
      currency: "NGN",
      format: "bundle",
      fileUrl: "",
      genre: "Fiction Collection",
      tags: ["bundle", "box set", "collection"],
      language: "English",
      isbn: "978-1-234567-05-9",
      pageCount: 890,
      publishedDate: "2025-01-15",
      published: true,
      featured: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.collection("books").insertMany(books);

  console.log(`Seeded ${books.length} books.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
