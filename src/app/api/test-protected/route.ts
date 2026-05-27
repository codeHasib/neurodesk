import { verifyToken } from "@/lib/api-verify";
import { connectDB } from "@/lib/db";

export async function GET(req: Request): Promise<unknown> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      Response.json(
        {
          message: "No token",
        },
        {
          status: 401,
        },
      );
    }
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token);
    const db = await connectDB();
    const collection = db.collection("test-protected");
    const cursor = collection.find();
    const result = await cursor.toArray();
    return Response.json(result);
  } catch (err) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
}
