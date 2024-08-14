import { NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemtype } = body;

    if (!itemtype) {
      return NextResponse.json({ error: "Item type is required" }, { status: 400 });
    }

    const newItemType = await prisma.type.create({
      data: { itemtype: itemtype },
    });

    return NextResponse.json(newItemType, { status: 201 });
  } catch (error) {
    console.error("Error creating item type:", error);
    return NextResponse.json({ error: "Failed to create item type" }, { status: 500 });
  }
}
