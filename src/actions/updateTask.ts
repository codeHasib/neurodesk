import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/model/task.model";
import { Workspace } from "@/model/workspace.model";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const updateTask = async (id: string, data: any) => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({ headers: await headers() });
    const user = await verifyToken(token);

    if (!user?.id) return new Response("Unauthorized", { status: 401 });

    const existingTask = await Task.findById(id);
    if (!existingTask) return new Response("Task not found", { status: 404 });

    // 1. Check if user is Workspace Admin
    const workspace = await Workspace.findOne({
      _id: existingTask.workSpaceId,
      members: { $elemMatch: { userId: user.id, role: "admin" } },
    });

    // 2. Check if user is the Owner (Creator)
    const isOwner = existingTask.ownerId === user.id;

    // 3. Check if user is the Assigned Member
    // Fix: We check if the current user's ID matches the assignedTo field
    const isAssigned = existingTask.assignedTo === user.id;

    // Permission Logic: Admin OR Owner OR Assigned Member can update
    if (!workspace && !isOwner && !isAssigned) {
      return new Response("Forbidden: Insufficient permissions", {
        status: 403,
      });
    }

    // Surgical Update: Only allow the fields sent from the status-only form
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );

    revalidatePath(`/dashboard/tasks`);
    return Response.json(updatedTask);
  } catch (error) {
    console.error("TASK_UPDATE_ERROR:", error);
    return new Response("Update Failed", { status: 500 });
  }
};
