import { NextRequest, NextResponse } from "next/server";
import prisma from "@/Lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        orders: {
          select: {
            id: true,
            itemid: true,
            duedate: true,
            pending: true,
            request: true,
            requestTime: true,
            item: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details and orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
