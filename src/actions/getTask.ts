import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/model/task.model";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";

export const getTask = async () => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    const user = await verifyToken(token);
    const userId = user?.id;
    const tasks = await Task.find({ ownerId: userId });
    return Response.json(tasks);
  } catch (error) {
    return Response.error();
  }
};

export const getTaskById = async (id: string) => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    const user = await verifyToken(token);
    const userId = user?.id;
    const task = await Task.findOne({ _id: id, ownerId: userId });
    return Response.json(task);
  } catch (error) {
    return Response.error();
  }
};
