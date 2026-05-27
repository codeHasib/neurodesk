import { getProjectById } from "@/actions/getProjects";


export const dynamic = "force-dynamic";

export const GET = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  // Execute the retrieval action
  return getProjectById(id);
};
