import { acceptInvitation } from "@/actions/acceptInvitation"; // Or wherever your function is

export async function POST(req: Request) {
  const body = await req.json();
  const { invitationId } = body;

  // Call your existing function logic
  return await acceptInvitation(invitationId);
}
