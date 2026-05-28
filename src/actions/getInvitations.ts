import { verifyToken } from "@/lib/api-verify";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Invitation } from "@/model/invitation.model";
import { headers } from "next/headers";

export const getMyInvitations = async () => {
  try {
    await connectDB();

    // 1. Ensure headers are awaited properly
    const headerList = await headers();
    const { token } = await auth.api.getToken({ headers: headerList });

    if (!token) {
      console.warn("INVITE_FETCH: No token found");
      return [];
    }

    const user = await verifyToken(token);
    if (!user?.email) {
      console.warn("INVITE_FETCH: No user email in token");
      return [];
    }

    // 2. Use regex for case-insensitive email matching
    const emailRegex = new RegExp(`^${user.email}$`, "i");

    const invitations = await Invitation.find({
      email: emailRegex,
      status: "pending",
    }).populate("workspaceId", "name");

    console.log(
      `INVITE_FETCH_SUCCESS: Found ${invitations.length} invites for ${user.email}`,
    );
    return invitations;
  } catch (error) {
    console.error("INVITE_FETCH_FAILURE:", error);
    return [];
  }
};
