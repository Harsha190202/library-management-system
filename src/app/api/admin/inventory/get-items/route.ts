import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/Lib/prisma";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, categoryId, typeId } = req.query;

    const filters: any = {};

    if (name) filters.name = { contains: String(name) };
    if (categoryId) filters.categoryId = Number(categoryId);
    if (typeId) filters.typeId = Number(typeId);

    const items = await prisma.item.findMany({
      where: filters,
      include: {
        category: true,
        type: true,
      },
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
}
