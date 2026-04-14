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

    const pkg = await prisma.package.findUnique({
      where: { id },
      include: { deliveries: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (pkg.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Error fetching package:", error);
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

    const pkg = await prisma.package.findUnique({
      where: { id },
      include: { deliveries: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (pkg.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (pkg.deliveries.length > 0) {
      return NextResponse.json(
        { error: "Cannot edit package that has active delivery requests" },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { fromCity, toCity, weight, description, urgency, preferredDate } = data;

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        fromCity,
        toCity,
        weight: weight ? parseFloat(weight) : undefined,
        description,
        urgency,
        preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      },
    });

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error("Error updating package:", error);
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

    const pkg = await prisma.package.findUnique({
      where: { id },
      include: { deliveries: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (pkg.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (pkg.deliveries.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete package that has active delivery requests" },
        { status: 400 }
      );
    }

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
