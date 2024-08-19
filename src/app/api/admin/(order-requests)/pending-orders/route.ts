import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function GET() {
  const now: Date = new Date();
  try {
    const pendingOrders = await prisma.order.findMany({
      where: {
        pending: true,
        duedate: {
          lt: now,
        },
      },
      select: {
        id: true,
        userid: true,
        itemid: true,
        duedate: true,
        request: true,
        requestTime: true,
        user: {
          select: {
            username: true,
          },
        },
        item: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(pendingOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
