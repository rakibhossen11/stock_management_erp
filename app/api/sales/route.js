import { dbConnect } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import Product from "@/app/models/Product";
import Sale from "@/app/models/Sale";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      throw new Error("At least one product item is required");
    }

    // Process items with guaranteed codes
    const itemsWithDetails = await Promise.all(
      body.items.map(async (item) => {
        const product = await Product.findById(item.id);
        if (!product) {
          throw new Error(`Product with ID ${item.id} not found`);
        }

        return {
          productId: product._id,
          code: product.productCode || `PROD-${product._id.toString().slice(-6)}`,
          name: product.name,
          price: product.sellingPrice,
          taxRate: product.taxRate || 0,
          quantity: item.quantity,
        };
      })
    );

    // Calculate totals
    const subtotal = itemsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = itemsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity * (item.taxRate || 0),
      0
    );
    const total = subtotal + tax - (body.discount || 0);

    // Create sale
    const saleData =({
      customer: '' || null,
      user: body.userId || null,
      date: body.date || new Date(),
      dueDate: body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      items: itemsWithDetails,
      subtotal,
      tax,
      discount: body.discount || 0,
      total,
      notes: body.notes || "",
      terms: body.terms || "Payment due within 7 days",
      status: body.status || "pending",
      paymentMethod: body.paymentMethod || "cash",
      invoiceNumber: body.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`
    });

    console.log(saleData);

    const sales = new Sale(saleData);
    await sales.save();

    // Update product quantities
    // await Promise.all(
    //   itemsWithDetails.map(item =>
    //     Product.findByIdAndUpdate(
    //       item.productId,
    //       { $inc: { quantity: -item.quantity } }
    //     )
    //   )
    // );

    return NextResponse.json(
      { message: "Sale created successfully", sale: sales },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating sale:", {
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors
    });
    return NextResponse.json(
      { 
        message: error.message || "Error creating sale",
        validationErrors: error.errors
      }, 
      { status: 500 }
    );
  }
}

