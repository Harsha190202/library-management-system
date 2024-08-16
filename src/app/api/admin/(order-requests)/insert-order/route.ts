import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function POST(req: NextRequest) {
  const { selectedid, username } = await req.json();

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  const item = await prisma.item.findUnique({
    where: { id: selectedid },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  if (!item || item.quantity === 0) {
    return NextResponse.json({ message: "No items left" }, { status: 400 });
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const order = await prisma.order.create({
    data: {
      userid: user.id,
      itemid: item.id,
      duedate: dueDate,
    },
  });

  await prisma.item.update({
    where: { id: selectedid },
    data: { quantity: item.quantity - 1 },
  });

  return NextResponse.json({ message: "Order created successfully" }, { status: 200 });
}
