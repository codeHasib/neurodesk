import { getMyInvitations } from "@/actions/getInvitations";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const invites = await getMyInvitations();
  return Response.json(invites);
};
