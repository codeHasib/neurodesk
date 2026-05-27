import { addWorkspace } from "@/actions/addWorkSpace";

export const POST = async (req: Request) => {
  try {
    return addWorkspace(req);
  } catch (error) {
    console.error("Error occurred while adding workspace:", error);
    return new Response("Failed to create workspace", { status: 500 });
  }
};
