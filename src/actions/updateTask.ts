import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/model/task.model";
import { headers } from "next/headers";

type Task = {
  title: string;
  description: string;
  projectId: string;
  workSpaceId: string;
  status: string;
};

export const updateTask = async (id: string, data: Partial<Task>) => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    const user = await verifyToken(token);
    const userId = user?.id;
    const task = await Task.findOneAndUpdate(
      { _id: id, ownerId: userId },
      { $set: { ...data, ownerId: userId } },
      { new: true },
    );
    return Response.json(task);
  } catch (error) {
    return Response.error();
  }
};
