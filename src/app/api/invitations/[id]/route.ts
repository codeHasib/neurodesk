import { connectDB } from "@/lib/db";
import { Invitation } from "@/model/invitation.model";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await context.params;

  await Invitation.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
