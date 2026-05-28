import { acceptInvitation } from "@/actions/acceptInvitation";

export const POST = async (req: Request) => {
  const { invitationId } = await req.json();
  return acceptInvitation(invitationId);
};
