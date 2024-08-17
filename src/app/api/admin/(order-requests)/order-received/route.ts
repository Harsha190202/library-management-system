// pages/api/admin/mark-received.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();

  if (!orderId || typeof orderId !== "number") {
    return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  const item = await prisma.item.findUnique({
    where: { id: order.itemid },
  });

  if (!item) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  const updatedItem = await prisma.item.update({
    where: { id: item.id },
    data: {
      quantity: item.quantity + 1,
    },
  });

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      pending: false,
    },
  });

  return NextResponse.json({ message: "Order updated successfully", item: updatedItem }, { status: 200 });
}
