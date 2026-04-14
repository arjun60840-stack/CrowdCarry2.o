import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { deliveries: true },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { deliveries: true },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (trip.deliveries.length > 0) {
      return NextResponse.json(
        { error: "Cannot edit trip that has active delivery requests" },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { fromCity, toCity, departureDate, departureTime, availableWeight, pricePerKg, transportMode, description } = data;

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        fromCity,
        toCity,
        departureDate: departureDate ? new Date(departureDate) : undefined,
        departureTime,
        availableWeight: availableWeight ? parseFloat(availableWeight) : undefined,
        pricePerKg: pricePerKg ? parseFloat(pricePerKg) : undefined,
        transportMode,
        description,
      },
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { deliveries: true },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (trip.deliveries.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete trip that has active delivery requests" },
        { status: 400 }
      );
    }

    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
