import { deleteTask } from "@/actions/deletTask";

export const DELETE = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  console.log(id);

  return deleteTask(id);
};