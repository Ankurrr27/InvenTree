import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        createdBy: true,
      },
    });

    return Response.json(products);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        purchasePrice: body.purchasePrice,
        sellingPrice: body.sellingPrice,
        minStockLevel: body.minStockLevel,
        category: body.category,
        createdById: body.createdById,
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