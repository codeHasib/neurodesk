import { getProjects } from "@/actions/getProjects";

export const GET = async () => {
  const projects = await getProjects();
  return projects;
};
