import { connectDB } from "@/lib/db";
import { Workspace } from "@/model/workspace.model";
import { Invitation } from "@/model/invitation.model";
import { revalidatePath } from "next/cache";

export const acceptInvitation = async (
  invitationId: string,
  userId: string,
) => {
  await connectDB();

  // 1. Find the invitation
  const invite = await Invitation.findById(invitationId);
  if (!invite || invite.status !== "pending") {
    throw new Error("Invitation invalid or already processed");
  }

  // 2. Add user to Workspace members
  await Workspace.findByIdAndUpdate(invite.workspaceId, {
    $push: { members: { userId: userId, role: invite.role } },
  });

  // 3. Mark invitation as accepted (or delete it)
  await Invitation.findByIdAndDelete(invitationId);

  revalidatePath("/workspaces");
  return { success: true };
};
