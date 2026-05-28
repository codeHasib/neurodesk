import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/model/workspace.model";
import { Invitation } from "@/model/invitation.model";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const acceptInvitation = async (invitationId: string) => {
  try {
    await connectDB();

    // 1. Authentication Check
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });

    if (!token) return new Response("Unauthorized", { status: 401 });

    const user = await verifyToken(token);
    const userId = user.id;
    const userEmail = user.email;

    // 2. Locate and Validate Invitation
    const invitation = await Invitation.findById(invitationId);

    if (!invitation) {
      return new Response("Invitation not found", { status: 404 });
    }

    // Security Guard: Ensure the logged-in user's email matches the invite
    if (invitation.email !== userEmail) {
      return new Response("Identity mismatch: This invite was not sent to you", { status: 403 });
    }

    if (invitation.status !== "pending") {
      return new Response("Invitation already processed", { status: 400 });
    }

    // 3. Atomic Membership Injection
    // We add the user to the workspace's member array with the role specified in the invite
    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      invitation.workspaceId,
      {
        $addToSet: { 
          members: { 
            userId: userId, 
            role: invitation.role 
          } 
        }
      },
      { new: true }
    );

    if (!updatedWorkspace) {
      return new Response("Target workspace no longer exists", { status: 404 });
    }

    // 4. Cleanup
    // Mark as accepted or delete. Deleting keeps the DB clean.
    await Invitation.findByIdAndDelete(invitationId);

    revalidatePath("/dashboard");
    revalidatePath("/workspaces");

    return new Response(JSON.stringify({ success: true, workspaceId: updatedWorkspace._id }), { 
      status: 200 
    });

  } catch (error) {
    console.error("INVITE_ACCEPT_CRITICAL_FAILURE:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};