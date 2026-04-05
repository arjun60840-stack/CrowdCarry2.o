import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a random 4-digit OTP */
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/** Format currency in INR */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Indian cities for the platform */
export const CITIES = [
  "Delhi",
  "Jaipur",
  "Agra",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Lucknow",
] as const;

export type City = (typeof CITIES)[number];

/** Calculate match percentage between trip and package */
export function calculateMatchScore(
  trip: { fromCity: string; toCity: string; departureDate: Date; availableWeight: number },
  pkg: { fromCity: string; toCity: string; preferredDate: Date; weight: number }
): number {
  let score = 0;

  // Route match (40 points)
  if (trip.fromCity === pkg.fromCity && trip.toCity === pkg.toCity) {
    score += 40;
  } else if (trip.fromCity === pkg.fromCity || trip.toCity === pkg.toCity) {
    score += 20;
  }

  // Weight fit (25 points)
  if (trip.availableWeight >= pkg.weight) {
    score += 25;
  } else if (trip.availableWeight >= pkg.weight * 0.8) {
    score += 15;
  }

  // Date match (25 points)
  const tripDate = new Date(trip.departureDate);
  const pkgDate = new Date(pkg.preferredDate);
  const daysDiff = Math.abs(
    (tripDate.getTime() - pkgDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff === 0) score += 25;
  else if (daysDiff <= 1) score += 20;
  else if (daysDiff <= 2) score += 15;
  else if (daysDiff <= 3) score += 10;

  // Trust bonus (10 points)
  score += 10;

  return Math.min(score, 100);
}

/** Delivery status steps */
export const DELIVERY_STEPS = [
  { key: "PENDING", label: "Pending", icon: "Clock" },
  { key: "ACCEPTED", label: "Accepted", icon: "CheckCircle" },
  { key: "PICKED_UP", label: "Picked Up", icon: "Package" },
  { key: "IN_TRANSIT", label: "In Transit", icon: "Train" },
  { key: "DELIVERED", label: "Delivered", icon: "MapPin" },
] as const;
