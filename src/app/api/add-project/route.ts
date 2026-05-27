import { addProject } from "@/actions/addProject";

export const POST = async (req: Request) => {
  const body = await req.json();
  return addProject(body);
};
