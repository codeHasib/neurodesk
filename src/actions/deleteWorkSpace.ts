import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/model/workspace.model"; // Ensure your model name matches
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const deleteWorkspace = async (id: string) => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({ headers: await headers() });
    const user = await verifyToken(token);

    if (!user?.id) return new Response("Unauthorized", { status: 401 });

    const result = await Workspace.deleteOne({ _id: id, ownerId: user.id });

    if (result.deletedCount > 0) {
      revalidatePath("/dashboard/workspaces");
      return Response.json({ success: true });
    }
    return new Response("Delete Failed", { status: 404 });
  } catch (error) {
    return new Response("Internal Error", { status: 500 });
  }
};
