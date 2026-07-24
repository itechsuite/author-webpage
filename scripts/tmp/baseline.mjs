import "dotenv/config";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || "author_platform");
const orders = await db.collection("orders").countDocuments();
const customers = await db.collection("customers").countDocuments();
console.log("Baseline orders:", orders, "Baseline customers:", customers);
await client.close();
