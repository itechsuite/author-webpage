import "dotenv/config";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || "author_platform");
const books = await db.collection("books").find({}, { projection: { title: 1, slug: 1, published: 1 } }).toArray();
console.log(JSON.stringify(books, null, 2));
await client.close();
