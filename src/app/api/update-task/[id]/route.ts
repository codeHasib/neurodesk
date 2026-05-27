import { updateTask } from "@/actions/updateTask";

export const PATCH = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;
  const data = await req.json();
  return updateTask(id, data);
};
