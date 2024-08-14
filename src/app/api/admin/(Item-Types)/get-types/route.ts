import prisma from "@/Lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const types = await prisma.type.findMany({});
  return NextResponse.json(types);
}
