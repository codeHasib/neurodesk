import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/model/workspace.model";
import { headers } from "next/headers";

export const getWorkspace = async () => {
  await connectDB();
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  if (!token) {
    return Promise.reject(new Error("Failed to retrieve token"));
  }

  const user = await verifyToken(token);
  if (!user) {
    return Promise.reject(new Error("Failed to verify user"));
  }

  const userId = user.id;

  /**
   * UPDATED QUERY:
   * Find workspaces where the user is EITHER the owner
   * OR is listed in the members array.
   */
  const workSpaces = await Workspace.find({
    $or: [{ ownerId: userId }, { "members.userId": userId }],
  });

  return workSpaces;
};

export const getWorkspaceById = async (id: string) => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({ headers: await headers() });
    const user = await verifyToken(token);

    if (!user?.id) return new Response("Unauthorized", { status: 401 });

    /**
     * UPDATED QUERY:
     * We no longer strictly check ownerId.
     * We check if the ID matches AND the user is a member/owner.
     */
    const workspace = await Workspace.findOne({
      _id: id,
      $or: [{ ownerId: user.id }, { "members.userId": user.id }],
    });

    if (!workspace) return new Response("Workspace not found", { status: 404 });

    return Response.json(workspace);
  } catch (error) {
    console.error("GET_WORKSPACE_BY_ID_ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
