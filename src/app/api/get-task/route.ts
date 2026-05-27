import { getTask } from "@/actions/getTask";

export const GET = async () => {
  return getTask();
};
