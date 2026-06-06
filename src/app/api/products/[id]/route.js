import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    return Response.json(product);
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

    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: body,
    });

    return Response.json(product);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return Response.json({
      message: "Product deleted",
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}