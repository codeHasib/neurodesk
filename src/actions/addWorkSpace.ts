import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/model/workspace.model";
import { headers } from "next/headers";

export const addWorkspace = async (req: Request) => {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await verifyToken(token);
  const ownerId = user.id;
  await connectDB();
  const body = await req.json();

  const newWorkspace = await Workspace.create({ ...body, ownerId: ownerId });
  return new Response(JSON.stringify(newWorkspace), { status: 201 });
};
