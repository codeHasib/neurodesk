import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Project } from "@/model/project.model";
import { headers } from "next/headers";

// Synced with your Mongoose Schema
type ProjectData = {
  name: string;
  workSpaceId: string;
  ownerId: string;
  color?: string;
  description?: string;
};

export const updateProject = async (id: string, data: Partial<ProjectData>) => {
  try {
    await connectDB();

    const { token } = await auth.api.getToken({
      headers: await headers(),
    });

    if (!token) return new Response("Unauthorized", { status: 401 });

    const user = await verifyToken(token);
    const userId = user?.id;

    if (!userId) return new Response("Unauthorized", { status: 401 });

    // Restrict update to the owner of the project
    const project = await Project.findOneAndUpdate(
      { _id: id, ownerId: userId },
      {
        $set: {
          ...data,
          ownerId: userId, // Ensures ownerId remains consistent
        },
      },
      { new: true },
    );

    if (!project) {
      return new Response("Project not found or unauthorized", { status: 404 });
    }

    return Response.json(project);
  } catch (error) {
    console.error("Critical: Project update failure", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
