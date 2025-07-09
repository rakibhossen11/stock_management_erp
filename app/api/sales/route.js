import { dbConnect } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import Product from "@/app/models/Product";
import Sale from "@/app/models/Sale";
import { getSession } from "@/app/lib/auth";

export async function POST(request) {
  try {
    const session = await getSession();
    // console.log(session.user);
    await dbConnect();
    const body = await request.json();
    // console.log(body);

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      throw new Error("At least one product item is required");
    }

    // Get the latest invoice number from the database
    const lastSale = await Sale.findOne().sort({ invoiceNumber: -1 }).limit(1);
    let nextInvoiceNumber = "INV-000001"; // Default if no sales exist

    if (lastSale?.invoiceNumber) {
      // Extract the numeric part and increment
      const lastNumber = parseInt(lastSale.invoiceNumber.split("-")[1], 10);
      if (isNaN(lastNumber)) {
        // Handle case where invoiceNumber format is invalid
        nextInvoiceNumber = `INV-${(await Sale.countDocuments()) + 1}`.padStart(
          6,
          "0"
        );
      } else {
        nextInvoiceNumber = `INV-${(lastNumber + 1)
          .toString()
          .padStart(6, "0")}`;
      }
    }

    // // Process items with guaranteed codes
    const itemsWithDetails = await Promise.all(
      body.items.map(async (item) => {
        const product = await Product.findById(item.id);
        if (!product) {
          throw new Error(`Product with ID ${item.id} not found`);
        }

        return {
          productId: product._id,
          code:
            product.productCode || `PROD-${product._id.toString().slice(-6)}`,
          name: product.name,
          price: product.price,
          // taxRate: product.taxRate || 0,
          quantity: item.quantity,
        };
      })
    );

    // Calculate totals
    const subtotal = itemsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // console.log(subtotal);

    // const tax = itemsWithDetails.reduce(
    //   (sum, item) => sum + item.price * item.quantity * (item.taxRate || 0),
    //   0
    // );
    // const total = subtotal + tax - (body.discount || 0);

    // // Create sale
    const saleData = {
      customer: "" || null,
      userId: session.user._id || null,
      userCode: session.user.userId || null,
      date: body.date || new Date(),
      dueDate: body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      items: itemsWithDetails,
      subtotal,
      // tax,
      discount: body.discount || 0,
      // total,
      notes: body.notes || "",
      terms: body.terms || "Payment due within 7 days",
      status: body.status || "pending",
      paymentMethod: body.paymentMethod || "cash",
      // invoiceNumber: nextInvoiceNumber,
      invoiceNumber: body.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
    };

    console.log(saleData);

    const sales = new Sale(saleData);
    await sales.save();

    // Update product quantities
    await Promise.all(
      itemsWithDetails.map((item) =>
        Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { new: true }
        )
      )
    );

    return NextResponse.json(
      { message: "Sale created successfully", sale: sales },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sale:", {
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors,
    });
    return NextResponse.json(
      {
        message: error.message || "Error creating sale",
        validationErrors: error.errors,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // Fetch all products from the database
    const sales = await Sale.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-__v"); // Exclude the __v field

    return NextResponse.json(
      {
        success: true,
        count: sales.length,
        data: sales,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching products",
        error: error.message, // Include error message for debugging
      },
      { status: 500 }
    );
  }
}
