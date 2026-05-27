import { updateWorkspace } from "@/actions/updateWorkSpace";

export const PATCH = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;
  const data = await req.json();
  return updateWorkspace(id, data);
};
