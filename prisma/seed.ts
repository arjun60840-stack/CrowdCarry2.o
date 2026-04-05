// Seed script — populates demo data for CrowdCarry
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CrowdCarry database...");

  // Create demo users
  const traveler1 = await prisma.user.upsert({
    where: { phone: "9876543210" },
    update: {},
    create: {
      phone: "9876543210",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "TRAVELER",
      trustScore: 94,
      aadhaarVerified: true,
      city: "Delhi",
      totalEarnings: 12500,
      totalDeliveries: 18,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    },
  });

  const traveler2 = await prisma.user.upsert({
    where: { phone: "9876543211" },
    update: {},
    create: {
      phone: "9876543211",
      name: "Priya Gupta",
      email: "priya@example.com",
      role: "BOTH",
      trustScore: 97,
      aadhaarVerified: true,
      city: "Jaipur",
      totalEarnings: 8200,
      totalDeliveries: 12,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
  });

  const sender1 = await prisma.user.upsert({
    where: { phone: "9876543212" },
    update: {},
    create: {
      phone: "9876543212",
      name: "Amit Patel",
      email: "amit@example.com",
      role: "SENDER",
      trustScore: 88,
      aadhaarVerified: true,
      city: "Delhi",
      totalEarnings: 0,
      totalDeliveries: 5,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    },
  });

  const sender2 = await prisma.user.upsert({
    where: { phone: "9876543213" },
    update: {},
    create: {
      phone: "9876543213",
      name: "Neha Singh",
      email: "neha@example.com",
      role: "SENDER",
      trustScore: 91,
      aadhaarVerified: false,
      city: "Agra",
      totalEarnings: 0,
      totalDeliveries: 3,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
    },
  });

  const traveler3 = await prisma.user.upsert({
    where: { phone: "9876543214" },
    update: {},
    create: {
      phone: "9876543214",
      name: "Vikram Mehta",
      email: "vikram@example.com",
      role: "TRAVELER",
      trustScore: 92,
      aadhaarVerified: true,
      city: "Delhi",
      totalEarnings: 6300,
      totalDeliveries: 9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    },
  });

  // Create demo trips
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const trip1 = await prisma.trip.create({
    data: {
      userId: traveler1.id,
      fromCity: "Delhi",
      toCity: "Jaipur",
      departureDate: tomorrow,
      departureTime: "06:00",
      availableWeight: 10,
      pricePerKg: 150,
      transportMode: "train",
      description: "Rajdhani Express — Delhi to Jaipur, can carry medium-sized packages",
      status: "UPCOMING",
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      userId: traveler2.id,
      fromCity: "Jaipur",
      toCity: "Delhi",
      departureDate: nextWeek,
      departureTime: "14:30",
      availableWeight: 5,
      pricePerKg: 200,
      transportMode: "train",
      description: "Shatabdi Express — returning to Delhi, limited space available",
      status: "UPCOMING",
    },
  });

  const trip3 = await prisma.trip.create({
    data: {
      userId: traveler1.id,
      fromCity: "Delhi",
      toCity: "Agra",
      departureDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
      departureTime: "08:15",
      availableWeight: 15,
      pricePerKg: 120,
      transportMode: "train",
      description: "Gatimaan Express — fast trip to Agra, spacious luggage area",
      status: "UPCOMING",
    },
  });

  const trip4 = await prisma.trip.create({
    data: {
      userId: traveler3.id,
      fromCity: "Delhi",
      toCity: "Jaipur",
      departureDate: tomorrow,
      departureTime: "20:00",
      availableWeight: 8,
      pricePerKg: 175,
      transportMode: "bus",
      description: "Volvo bus — overnight journey, good for sturdy packages",
      status: "UPCOMING",
    },
  });

  // Create demo packages
  const pkg1 = await prisma.package.create({
    data: {
      userId: sender1.id,
      fromCity: "Delhi",
      toCity: "Jaipur",
      weight: 3,
      description: "Handloom sarees — gift for family, handle with care",
      urgency: "MEDIUM",
      preferredDate: tomorrow,
      status: "POSTED",
      estimatedCost: 450,
    },
  });

  const pkg2 = await prisma.package.create({
    data: {
      userId: sender2.id,
      fromCity: "Delhi",
      toCity: "Agra",
      weight: 5,
      description: "Electronics — laptop and accessories, insured",
      urgency: "HIGH",
      preferredDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: "POSTED",
      estimatedCost: 600,
    },
  });

  const pkg3 = await prisma.package.create({
    data: {
      userId: sender1.id,
      fromCity: "Jaipur",
      toCity: "Delhi",
      weight: 2,
      description: "Rajasthani sweets box — perishable, deliver same day",
      urgency: "EXPRESS",
      preferredDate: nextWeek,
      status: "POSTED",
      estimatedCost: 400,
    },
  });

  // Create a demo active delivery
  const delivery1 = await prisma.delivery.create({
    data: {
      tripId: trip1.id,
      packageId: pkg1.id,
      travelerId: traveler1.id,
      senderId: sender1.id,
      status: "IN_TRANSIT",
      matchScore: 94,
      pickupOtp: "4523",
      deliveryOtp: "7891",
      price: 450,
      pickedUpAt: new Date(),
    },
  });

  // Create demo ratings
  await prisma.rating.createMany({
    data: [
      {
        deliveryId: delivery1.id,
        giverId: sender1.id,
        receiverId: traveler1.id,
        score: 5,
        comment: "Very reliable! Package arrived in perfect condition.",
      },
    ],
  });

  // Create demo transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: sender1.id,
        type: "PAYMENT",
        amount: 450,
        status: "COMPLETED",
        razorpayId: "pay_demo_123",
        description: "Payment for delivery DEL-001",
      },
      {
        userId: traveler1.id,
        type: "PAYOUT",
        amount: 405,
        status: "COMPLETED",
        upiId: "rahul@upi",
        description: "Payout for delivery DEL-001 (after 10% platform fee)",
      },
      {
        userId: traveler1.id,
        type: "PAYOUT",
        amount: 750,
        status: "COMPLETED",
        upiId: "rahul@upi",
        description: "Payout for delivery DEL-002",
      },
    ],
  });

  // Demo messages
  await prisma.message.createMany({
    data: [
      {
        deliveryId: delivery1.id,
        senderId: sender1.id,
        receiverId: traveler1.id,
        content: "Hi Rahul! I'll be at New Delhi station platform 5 at 5:30 AM.",
      },
      {
        deliveryId: delivery1.id,
        senderId: traveler1.id,
        receiverId: sender1.id,
        content: "Perfect, I'll be there. My seat is in Coach B3. Look for a blue jacket!",
      },
      {
        deliveryId: delivery1.id,
        senderId: sender1.id,
        receiverId: traveler1.id,
        content: "Great, see you there. The package is a medium-sized box 📦",
      },
    ],
  });

  console.log("✅ Seed data created successfully!");
  console.log(`   → ${5} users`);
  console.log(`   → ${4} trips`);
  console.log(`   → ${3} packages`);
  console.log(`   → ${1} active delivery`);
  console.log(`   → ${1} rating`);
  console.log(`   → ${3} transactions`);
  console.log(`   → ${3} messages`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
