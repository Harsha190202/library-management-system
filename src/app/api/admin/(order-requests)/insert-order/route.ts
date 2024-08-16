import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";
export async function POST(req: NextRequest) {
  const { selectedid, username } = await req.json();

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  const item = await prisma.item.findUnique({
    where: { id: selectedid },
  });

  console.log(item);
  return NextResponse.json({ message: "OK" }, { status: 200 });
}
