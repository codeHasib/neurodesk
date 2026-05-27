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
