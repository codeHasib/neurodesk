import { connectDB } from "@/lib/db";

export async function GET(): Promise<unknown> {
  const db = await connectDB();
  const collection = await db.collection("test").find().toArray();
  return Response.json(collection);
}
