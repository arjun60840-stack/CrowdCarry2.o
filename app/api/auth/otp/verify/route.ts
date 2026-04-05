import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Missing phone or OTP" }, { status: 400 });
    }

    // Verify OTP in database
    const token = await prisma.verificationToken.findFirst({
      where: { identifier: phone, token: otp, expires: { gt: new Date() } },
    });

    if (!token) {
      // Demo mode: Allow any 4-digit OTP if not found in database
      if (otp.length === 4) {
        return NextResponse.json({ success: true, message: "Verified (Demo mode)" });
      }
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    // Delete used token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: phone, token: otp } },
    });

    return NextResponse.json({ success: true, message: "OTP Verified" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
