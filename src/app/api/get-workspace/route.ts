import { getWorkspace } from "@/actions/getWorkSpace";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const workSpaces = await getWorkspace();
    return NextResponse.json(workSpaces);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
