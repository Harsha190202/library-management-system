import { NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, categoryId, typeId } = await req.json();

    const filters: any = {};

    if (name) {
      filters.name = {
        contains: name,
        mode: "insensitive",
      };
    }
    if (categoryId) filters.categoryId = Number(categoryId);
    if (typeId) filters.typeId = Number(typeId);

    const items = await prisma.item.findMany({
      where: filters,
      include: {
        category: true,
        type: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
