import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Invitation } from "@/model/invitation.model";
import { headers } from "next/headers";

export const getMyInvitations = async () => {
  try {
    await connectDB();
    const { token } = await auth.api.getToken({ headers: await headers() });
    const user = await verifyToken(token);

    if (!user?.email) return [];

    // Fetch pending invites and populate workspace info if you have a ref
    const invitations = await Invitation.find({
      email: user.email,
      status: "pending",
    }).populate("workspaceId", "name"); // Assumes Workspace model is registered

    return invitations;
  } catch (error) {
    console.error("INVITE_FETCH_FAILURE:", error);
    return [];
  }
};
