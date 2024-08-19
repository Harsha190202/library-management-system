import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const orderId = parseInt(params.id);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      userid: true,
      itemid: true,
      duedate: true,
      pending: true,
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

  return NextResponse.json(order, { status: 200 });
}
