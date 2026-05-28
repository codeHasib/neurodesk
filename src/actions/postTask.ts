import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/model/task.model";
import { Workspace } from "@/model/workspace.model";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const postTask = async (req: Request) => {
  await connectDB();
  const { token } = await auth.api.getToken({ headers: await headers() });

  if (!token) return new Response("Unauthorized", { status: 401 });
  const user = await verifyToken(token);

  const body = await req.json();
  const {
    title,
    description,
    projectId,
    workSpaceId,
    assignedTo,
    status,
    priority,
    dueDate,
  } = body;

  // SECURITY CHECK: Is the user actually a member of this workspace?
  const workspace = await Workspace.findOne({
    _id: workSpaceId,
    "members.userId": user.id,
  });

  if (!workspace) {
    return new Response("Forbidden: You are not a member of this workspace", {
      status: 403,
    });
  }

  const newTask = await Task.create({
    title,
    description,
    projectId,
    workSpaceId,
    ownerId: user.id, // The creator
    assignedTo: assignedTo || null, // The person doing the work
    status: status || "todo",
    priority: priority || "medium",
    dueDate: dueDate || null,
  });

  revalidatePath(`/dashboard/workspaces/${workSpaceId}`);
  return new Response(JSON.stringify(newTask), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
