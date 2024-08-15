import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const deletedItem = await prisma.item.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Item deleted successfully", deletedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ message: "Failed to delete item" }, { status: 500 });
  }
}
