import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  const { name, author, quantity, categoryId, typeId } = await req.json();

  try {
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name,
        author,
        quantity: Number(quantity),
        categoryId,
        typeId,
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
