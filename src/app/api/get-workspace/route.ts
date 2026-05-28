import { getWorkspace } from "@/actions/getWorkSpace";
import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async () => {
  try {
    const { token } = await auth.api.getToken({ headers: await headers() });
    const user = await verifyToken(token);

    // This action (which we updated earlier) now finds workspaces
    // where the user is either the owner OR a member.
    const workspaces = await getWorkspace();

    // We return an object so the frontend can distinguish roles
    return Response.json({
      workspaces: workspaces || [],
      userId: user.id,
    });
  } catch (error) {
    console.error("GET_WORKSPACE_ROUTE_ERROR:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
