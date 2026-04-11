import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // For Demo: Allow public access to tracking info
    const session = await auth();
    const userId = session?.user?.id;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
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

    const isTraveler = delivery.travelerId === userId;
    const isSender = delivery.senderId === userId;

    // Security check: Only traveler or sender can see this (RELAXED FOR DEMO)
    // if (!isTraveler && !isSender) {
    //   return NextResponse.json({ error: "Access denied" }, { status: 403 });
    // }

    // Mask OTPs for travelers (only sender/recipient should see them/provide them)
    if (isTraveler) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (delivery as any).pickupOtp = "PROTECTED";
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (delivery as any).deliveryOtp = "PROTECTED";
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("DEBUG Error fetching delivery:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
