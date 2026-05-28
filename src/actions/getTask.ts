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

    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    // UPDATE: Find tasks where user is the owner OR included in the assignedTo array
    const tasks = await Task.find({
      $or: [{ ownerId: userId }, { assignedTo: userId }],
    }).sort({ createdAt: -1 }); // Optional: sort by newest

    return Response.json(tasks);
  } catch (error) {
    console.error("GET_TASKS_ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
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

    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    // UPDATE: Allow viewing if user is owner OR assigned
    const task = await Task.find({
      $or: [
        { ownerId: userId },
        { "members.userId": userId }, // Use dot notation for nested arrays in MongoDB
      ],
    });

    

    if (!task) {
      return Response.json(
        { error: "Task not found or access denied" },
        { status: 404 },
      );
    }

    return Response.json(task);
  } catch (error) {
    console.error("GET_TASK_BY_ID_ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
