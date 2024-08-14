import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../Lib/auth";

export default async function Test() {
  const session = await auth();

  if (!session) return null;

  return (
    <div>
      <h2>{session?.user.username}</h2>
    </div>
  );
}
