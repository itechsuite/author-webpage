import "dotenv/config";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || "author_platform");

const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).limit(3).toArray();
console.log("=== LATEST ORDERS ===");
console.log(JSON.stringify(orders, null, 2));

const customers = await db.collection("customers").find({}).sort({ updatedAt: -1 }).limit(3).toArray();
console.log("=== LATEST CUSTOMERS ===");
console.log(JSON.stringify(customers, null, 2));

await client.close();
