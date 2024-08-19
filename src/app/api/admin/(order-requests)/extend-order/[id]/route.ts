import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { grant } = await req.json();

  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  if (typeof grant !== "boolean") {
    return NextResponse.json({ error: "Invalid grant value" }, { status: 400 });
  }

  try {
    if (grant) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          duedate: true,
          requestTime: true,
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const newDueDate = new Date(order.duedate);
      newDueDate.setDate(newDueDate.getDate() + order.requestTime);

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          duedate: newDueDate,
          request: false,
          requestTime: 0,
        },
      });

      return NextResponse.json(updatedOrder, { status: 200 });
    } else {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          request: false,
          requestTime: 0,
        },
      });

      return NextResponse.json(updatedOrder, { status: 200 });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
