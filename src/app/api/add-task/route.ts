import { postTask } from "@/actions/postTask";
import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const POST = async (req: Request) => {
  try {
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = await verifyToken(token);
    const ownerId = user.id;
    if (user) {
      return postTask(req);
    } else {
      return new Response("Forbidden", { status: 403 });
    }
  } catch (error) {
    console.error("Error occurred while posting task:", error);
    return new Response("Failed to create task", { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = await verifyToken(token);
    console.log(user.id);
  } catch (error) {
    console.error("Error occurred while posting task:", error);
    return new Response("Failed to create task", { status: 500 });
  }
};
