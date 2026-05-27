import { updateProject } from "@/actions/updateProject";

export const PATCH = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    const data = await req.json();

    // Pass execution to the Server Action
    return updateProject(id, data);
  } catch (error) {
    return new Response("Bad Request", { status: 400 });
  }
};
