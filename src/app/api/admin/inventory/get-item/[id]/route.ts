import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const item = await prisma.item.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 400 });
    }
    return NextResponse.json({ message: "Item sent ", item });
  } catch (error) {
    console.error("Error getting item:", error);
    return NextResponse.json({ message: "Failed to getitem" }, { status: 500 });
  }
}
