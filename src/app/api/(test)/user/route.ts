// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../Lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(session);
}
