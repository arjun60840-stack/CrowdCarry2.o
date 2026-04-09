import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      // For demo purposes, if not logged in, return 5 most recent across all users
      const packages = await prisma.package.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      });
      return NextResponse.json(packages);
    }

    const packages = await prisma.package.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { fromCity, toCity, weight, description, urgency, preferredDate, imageUrl } = data;

    if (!fromCity || !toCity || !weight || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPackage = await prisma.package.create({
      data: {
        userId,
        fromCity,
        toCity,
        weight: parseFloat(weight),
        description,
        urgency: urgency || "MEDIUM",
        preferredDate: new Date(preferredDate),
        imageUrl,
        status: "POSTED",
      } as any,
    });

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
