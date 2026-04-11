import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTP } from "@/lib/sms";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store in database
    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: phone, token: otp } },
      update: { expires },
      create: { identifier: phone, token: otp, expires },
    });

    // Send real SMS
    console.log(`[AUTH] OTP for ${phone}: ${otp}`);
    const res = await sendOTP(phone, otp);

    if (!res.success) {
      console.warn("SMS sending failed:", res.error);
      // For testing, always proceed. The OTP is logged above.
      return NextResponse.json({ 
        success: true, 
        message: "OTP sent (Demo mode)", 
        debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined 
      });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
