import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URI!;

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const db = await mongoose.connect(MONGODB_URI, {
    dbName: "NeuroDesk",
  });

  isConnected = db.connections[0].readyState === 1;

  console.log("MongoDB connected");
}
