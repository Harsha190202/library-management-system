import prisma from "@/Lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Id for type is required" }, { status: 400 });
    }

    const newCategory = await prisma.category.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Deleted" }, { status: 201 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to Delete category" }, { status: 500 });
  }
}
