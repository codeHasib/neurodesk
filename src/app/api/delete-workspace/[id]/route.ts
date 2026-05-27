import { deleteWorkspace } from "@/actions/deleteWorkSpace";

export const DELETE = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;
  return deleteWorkspace(id);
};
