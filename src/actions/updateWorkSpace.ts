import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/model/workspace.model";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type WorkspaceMember = {
  userId: string;
  role: "admin" | "member";
};

type WorkspaceData = {
  name: string;
  ownerId: string;
  members: WorkspaceMember[];
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

    // SECURITY: Only the ownerId (Root Admin) can modify workspace settings/roles
    const workspace = await Workspace.findOneAndUpdate(
      { _id: id, ownerId: user.id },
      {
        $set: {
          ...data,
          ownerId: user.id, // Lockdown ownerId to prevent accidental transfer
        },
      },
      { new: true },
    );

    if (!workspace) {
      return new Response("Workspace not found or access denied", {
        status: 404,
      });
    }

    revalidatePath("/dashboard/workspaces");
    revalidatePath(`/dashboard/edit-workspaces/${id}`);

    return Response.json(workspace);
  } catch (error) {
    console.error("WORKSPACE_UPDATE_ERROR:", error);
    return new Response("Update Failed", { status: 500 });
  }
};
