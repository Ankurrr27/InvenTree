import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const logs = await prisma.log.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        bill: {
          select: {
            billNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}