import { updateTask } from "@/actions/updateTask";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Standard Next.js 15 pattern
) => {
  try {
    const { id } = await params;
    const data = await req.json();
    return updateTask(id, data);
  } catch (error) {
    return new Response("Invalid Request", { status: 400 });
  }
};
