import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch deliveries where the user is either the traveler or the sender
    const deliveries = await prisma.delivery.findMany({
      where: {
        OR: [
          { travelerId: userId },
          { senderId: userId },
        ],
      },
      include: {
        trip: true,
        package: true,
        traveler: {
          select: { name: true, image: true, trustScore: true }
        },
        sender: {
          select: { name: true, image: true, trustScore: true }
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
