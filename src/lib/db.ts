import { Db, MongoClient, ServerApiVersion } from "mongodb";

const uri = `${process.env.DB_URI}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db: Db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("NeuroDesk");
  }
  return db;
}