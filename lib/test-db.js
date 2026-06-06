import "dotenv/config";
import prisma from "./prisma.js";

async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log(result);
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();