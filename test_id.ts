import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const d = await prisma.delivery.findFirst();
  console.log("ID:", d?.id);
  await prisma.$disconnect();
}
main();
