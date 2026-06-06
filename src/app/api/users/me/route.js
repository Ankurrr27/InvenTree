import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const userId = req.headers.get("userid");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(user);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}