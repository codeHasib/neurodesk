import { deleteProject } from "@/actions/deleteProject";

export const DELETE = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  // Logging for debugging during development
  console.log(`PURGE_SIGNAL_RECEIVED: Project ID ${id}`);

  return deleteProject(id);
};
