import prisma from "@/Lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({});
  return NextResponse.json(categories);
}
