import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, packageId } = await req.json();

    if (!amount || !packageId) {
      return NextResponse.json({ error: "Missing amount or packageId" }, { status: 400 });
    }

    // Demo Mode: Create a mock Razorpay order
    // In production, you would call razorpay.orders.create(...)
    const mockOrder = {
      id: "order_" + Math.random().toString(36).substring(7),
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: packageId,
      status: "created",
    };

    console.log(`[PAYMENT] Created mock Razorpay order: ${mockOrder.id} for package: ${packageId}`);

    return NextResponse.json(mockOrder);
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
