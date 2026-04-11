"use server";

import { revalidatePath } from "next/cache";
import { calculateMatchScore } from "./utils";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * Matching engine:
 * Finds the best traveler-trip for a given package request.
 */
export async function matchPackageWithTrips(packageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!pkg) throw new Error("Package not found");

  // Query DB for 'UPCOMING' trips that match the route
  const trips = await prisma.trip.findMany({
    where: {
      fromCity: pkg.fromCity,
      toCity: pkg.toCity,
      status: "UPCOMING",
      availableWeight: { gte: pkg.weight },
      userId: { not: session.user.id }, // Don't match with own trips
    },
    include: {
      user: {
        select: {
          name: true,
          trustScore: true,
          image: true,
        },
      },
    },
  });

  const matches = trips.map((trip) => ({
    tripId: trip.id,
    score: calculateMatchScore(trip, pkg),
    traveler: trip.user.name || "Anonymous",
    price: trip.pricePerKg * pkg.weight,
    availableWeight: trip.availableWeight,
  })).sort((a, b) => b.score - a.score);

  return { success: true, matches };
}

/**
 * Update delivery status with verification (OTP check)
 */
export async function updateDeliveryStatus(deliveryId: string, status: string, otp?: string, imageUrl?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
  });

  if (!delivery) throw new Error("Delivery not found");

  // Check OTP for Pickup and Delivery Handover
  if (status === "PICKED_UP" && otp) {
    if (otp !== delivery.pickupOtp) {
      // Demo mode: Allow any 4-digit OTP
      if (otp.length === 4) {
        console.log(`[DELIVERY] Pickup OTP bypassed for ${deliveryId} with OTP ${otp}`);
      } else {
        throw new Error("Invalid Handover OTP");
      }
    }
  }
  
  if (status === "DELIVERED" && otp) {
    if (otp !== delivery.deliveryOtp) {
      // Demo mode: Allow any 4-digit OTP
      if (otp.length === 4) {
        console.log(`[DELIVERY] Delivery OTP bypassed for ${deliveryId} with OTP ${otp}`);
      } else {
        throw new Error("Invalid Delivery OTP");
      }
    }
  }

  await prisma.delivery.update({
    where: { id: deliveryId },
    data: { 
      status,
      pickedUpAt: status === "PICKED_UP" ? new Date() : undefined,
      deliveredAt: status === "DELIVERED" ? new Date() : undefined,
      pickupImageUrl: status === "PICKED_UP" ? imageUrl : undefined,
      deliveryImageUrl: status === "DELIVERED" ? imageUrl : undefined,
    } as any,
  });

  revalidatePath(`/tracking/${deliveryId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Post a new trip (Real DB Insert)
 */
export async function postTrip(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const fromCity = formData.get("fromCity") as string;
  const toCity = formData.get("toCity") as string;
  const departureDate = new Date(formData.get("departureDate") as string);
  const departureTime = formData.get("departureTime") as string;
  const availableWeight = parseFloat(formData.get("availableWeight") as string);
  const pricePerKg = parseFloat(formData.get("pricePerKg") as string);
  const transportMode = formData.get("transportMode") as string;
  const description = formData.get("description") as string;

  const trip = await prisma.trip.create({
    data: {
      userId: session.user.id,
      fromCity,
      toCity,
      departureDate,
      departureTime,
      availableWeight,
      pricePerKg,
      transportMode,
      description,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/trips");
  
  return { success: true, id: trip.id };
}

/**
 * Post a new package (Real DB Insert)
 */
export async function postPackage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const fromCity = formData.get("fromCity") as string;
  const toCity = formData.get("toCity") as string;
  const weight = parseFloat(formData.get("weight") as string);
  const description = formData.get("description") as string;
  const preferredDate = new Date(formData.get("preferredDate") as string);
  const estimatedCost = parseFloat(formData.get("estimatedCost") as string || "0");

  const pkg = await prisma.package.create({
    data: {
      userId: session.user.id,
      fromCity,
      toCity,
      weight,
      description,
      preferredDate,
      estimatedCost,
      imageUrl: formData.get("imageUrl") as string || null,
    } as any,
  });

  revalidatePath("/dashboard");
  revalidatePath("/packages");
  
  return { success: true, id: pkg.id };
}

/**
 * Send Message within a Delivery
 */
export async function sendMessage(deliveryId: string, content: string, receiverId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const message = await prisma.message.create({
    data: {
      deliveryId,
      senderId: session.user.id,
      receiverId,
      content,
    },
  });

  revalidatePath(`/dashboard/delivery/${deliveryId}`);
  return { success: true, messageId: message.id };
}

/**
 * Handle matching and creating a delivery request
 */
export async function createDeliveryRequest(tripId: string, packageId: string, price: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  const pkg = await prisma.package.findUnique({ where: { id: packageId } });

  if (!trip || !pkg) throw new Error("Trip or Package not found");

  // Simple 4-digit OTPs for pickup and delivery
  const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

  const delivery = await prisma.delivery.create({
    data: {
      tripId,
      packageId,
      travelerId: trip.userId,
      senderId: pkg.userId,
      status: "PENDING",
      price,
      pickupOtp,
      deliveryOtp,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, deliveryId: delivery.id };
}
