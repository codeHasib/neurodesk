import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Project } from "@/model/project.model";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const deleteProject = async (id: string) => {
  try {
    await connectDB();

    const { token } = await auth.api.getToken({
      headers: await headers(),
    });

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await verifyToken(token);
    const userId = user?.id;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Security: Only delete if the project belongs to the authenticated user
    const result = await Project.deleteOne({ _id: id, ownerId: userId });

    if (result.deletedCount > 0) {
      // Revalidate the projects list and dashboard paths
      revalidatePath(`/dashboard/projects`);
      revalidatePath(`/dashboard`);

      return Response.json(
        { success: true, message: "Project purged" },
        { status: 200 },
      );
    }

    return Response.json(
      { success: false, message: "Project not found or unauthorized" },
      { status: 404 },
    );
  } catch (error) {
    console.error("Critical: Project deletion failure:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
