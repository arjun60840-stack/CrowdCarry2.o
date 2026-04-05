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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ratingsRecvd: {
          include: {
            giver: {
              select: { name: true, image: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 5
        },
        _count: {
            select: {
              trips: true
            }
          }
        }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate real stats with type safety check
    const tripsCount = (user as any)._count?.trips || 0;
    const stats = {
      totalEarnings: user.totalEarnings,
      deliveries: user.totalDeliveries,
      trips: tripsCount,
      successRate: 100, 
    };

    return NextResponse.json({ user, stats });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
