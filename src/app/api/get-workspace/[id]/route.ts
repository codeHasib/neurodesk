import { getWorkspaceById } from "@/actions/getWorkSpace";

export const dynamic = "force-dynamic";
export const GET = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;
  return getWorkspaceById(id);
};
