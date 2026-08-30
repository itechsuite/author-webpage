import "dotenv/config";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || "author_platform");
console.log("orders:", await db.collection("orders").countDocuments());
console.log("customers:", await db.collection("customers").countDocuments());
console.log("contact_threads:", await db.collection("contact_threads").countDocuments());
await client.close();
