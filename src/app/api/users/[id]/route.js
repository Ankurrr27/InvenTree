import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    return Response.json(user);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();

    const user = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: body,
    });

    return Response.json(user);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return Response.json({
      message: "User deleted",
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}