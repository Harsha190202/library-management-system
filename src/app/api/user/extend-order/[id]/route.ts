import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const orderId = parseInt(params.id);
  const { extensionDays } = await req.json();

  if (isNaN(orderId) || typeof extensionDays !== "number" || extensionDays <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const newDueDate = new Date(order.duedate);
    newDueDate.setDate(newDueDate.getDate() + extensionDays);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        duedate: newDueDate,
        request: true,
        requestTime: extensionDays,
      },
    });

    return NextResponse.json({ message: "Order extended successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error extending order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
