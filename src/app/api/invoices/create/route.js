import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userId,
      items,
      discount = 0,
      tax = 0,
      paymentMode = "CASH",
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const billItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `${product.name} has only ${product.quantity} left`,
          },
          { status: 400 }
        );
      }

      const lineTotal =
        Number(product.sellingPrice) * item.quantity;

      subtotal += lineTotal;

      billItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.sellingPrice,
        totalPrice: lineTotal,
      });
    }

    const totalAmount =
      subtotal - Number(discount) + Number(tax);

    const billNumber = `INV-${Date.now()}`;

    const bill = await prisma.$transaction(
      async (tx) => {
        const createdBill = await tx.bill.create({
          data: {
            billNumber,
            userId,
            subtotal,
            discount,
            tax,
            totalAmount,
            paymentMode,
          },
        });

        for (const item of billItemsData) {
          await tx.billItem.create({
            data: {
              ...item,
              billId: createdBill.id,
            },
          });

          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        await tx.log.create({
          data: {
            userId,
            billId: createdBill.id,
            action: "CREATE_BILL",
            message: `Bill ${billNumber} created`,
          },
        });

        return createdBill;
      }
    );

    return NextResponse.json(bill);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}