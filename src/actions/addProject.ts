import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Project } from "@/model/project.model";
import { headers } from "next/headers";

type ProjectData = {
  name: string;
  workSpaceId: string;
  color?: string;
  description?: string;
};

export const addProject = async (projectData: ProjectData) => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = await verifyToken(token);
    console.log(user);
    const newProject = Project.create({
      ...projectData,
      ownerId: user?.id,
    });
    return Response.json(newProject);
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};
