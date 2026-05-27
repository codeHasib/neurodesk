import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/model/task.model";
import { headers } from "next/headers";

export const postTask = async (req: Request) => {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await verifyToken(token);
  const ownerId = user.id;
  await connectDB();
  const body = await req.json();

  const newTask = await Task.create({ ...body, ownerId: ownerId });
  return new Response(JSON.stringify(newTask), { status: 201 });
};
