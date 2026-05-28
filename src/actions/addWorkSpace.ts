import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/model/workspace.model";
import { Invitation } from "@/model/invitation.model"; 
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const addWorkspace = async (req: Request) => {
  try {
    await connectDB();

    const { token } = await auth.api.getToken({
      headers: await headers(),
    });

    if (!token) return new Response("Unauthorized", { status: 401 });

    const user = await verifyToken(token);
    const ownerId = user.id;
    const body = await req.json();
    const { name, invitedMembers } = body;

    // 1. Create the Workspace with the Creator as the primary Admin member
    const newWorkspace = await Workspace.create({
      name,
      ownerId,
      members: [
        { userId: ownerId, role: "admin" }, // Add the creator immediately
      ],
    });

    // 2. If there are invited members, create Invitation records
    if (invitedMembers && invitedMembers.length > 0) {
      const invitationDocs = invitedMembers.map(
        (member: { email: string; role: string }) => ({
          workspaceId: newWorkspace._id,
          inviterId: ownerId,
          email: member.email,
          role: member.role,
          status: "pending",
        }),
      );

      await Invitation.insertMany(invitationDocs);
    }

    revalidatePath(`/dashboard`);
    revalidatePath(`/workspaces`);

    return new Response(JSON.stringify(newWorkspace), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("WORKSPACE_INIT_FAILURE:", error);
    return new Response("Failed to initialize team workspace", { status: 500 });
  }
};
