import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Project } from "@/model/project.model";
import { headers } from "next/headers";

export const getProjects = async () => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = await verifyToken(token);
    const projects = await Project.find({ ownerId: user?.id });
    return Response.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProjectById = async (id: string) => {
  try {
    await connectDB();

    // Authenticate the session
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

    // Secure retrieval: Project must match ID AND belong to the authenticated user
    const project = await Project.findOne({ _id: id, ownerId: userId });

    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    return Response.json(project);
  } catch (error) {
    console.error("Critical: Project retrieval failure:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
