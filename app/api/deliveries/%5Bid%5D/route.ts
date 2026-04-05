import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id: params.id },
      include: {
        trip: true,
        package: true,
        traveler: {
          select: { id: true, name: true, image: true, trustScore: true, phone: true }
        },
        sender: {
          select: { id: true, name: true, image: true, trustScore: true, phone: true }
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: { select: { name: true } }
          }
        }
      },
    });

    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    // Security check: Only traveler or sender can see this
    if (delivery.travelerId !== userId && delivery.senderId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("Error fetching delivery:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
