import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      // For demo, return all upcoming
      const trips = await prisma.trip.findMany({
        take: 5,
        orderBy: { departureDate: "asc" },
        include: { user: true },
      });
      return NextResponse.json(trips);
    }

    const trips = await prisma.trip.findMany({
      orderBy: { departureDate: "asc" },
      include: { user: true },
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
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
    const { fromCity, toCity, departureDate, departureTime, availableWeight, pricePerKg, transportMode, description } = data;

    if (!fromCity || !toCity || !departureDate || !departureTime || !availableWeight || !pricePerKg) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTrip = await prisma.trip.create({
      data: {
        userId,
        fromCity,
        toCity,
        departureDate: new Date(departureDate),
        departureTime,
        availableWeight: parseFloat(availableWeight),
        pricePerKg: parseFloat(pricePerKg),
        transportMode: transportMode || "train",
        description,
        status: "UPCOMING",
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
