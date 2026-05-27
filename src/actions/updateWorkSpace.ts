import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/model/workspace.model"; // Ensure your model name matches
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// DANGER IT NEEDS TO CHANGE ACCORDING TO SCHEMA

type WorkspaceMember = {
  userId: string;
  role: "admin" | "member";
};

type WorkspaceData = {
  name: string;
  ownerId: string;
  members?: WorkspaceMember[];
  createdAt?: Date; // From timestamps: true
  updatedAt?: Date; // From timestamps: true
};

export const updateWorkspace = async (
  id: string,
  data: Partial<WorkspaceData>,
) => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({ headers: await headers() });
    const user = await verifyToken(token);

    if (!user?.id) return new Response("Unauthorized", { status: 401 });

    const workspace = await Workspace.findOneAndUpdate(
      { _id: id, ownerId: user.id },
      { $set: { ...data, ownerId: user.id } },
      { new: true },
    );

    revalidatePath("/dashboard/workspaces");
    return Response.json(workspace);
  } catch (error) {
    return new Response("Update Failed", { status: 500 });
  }
};
