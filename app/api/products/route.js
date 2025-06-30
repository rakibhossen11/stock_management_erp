import { dbConnect } from "@/app/lib/dbConnect";
import Product from "@/app/models/Product";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getSession } from "@/app/lib/auth";

// export async function GET(request) {
//   try {
//     await dbConnect();

//      // Authentication
//     const authHeader = request.headers.get("authorization");
//     const token = authHeader?.split(" ")[1];

//     // Get query parameters
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 10;
//     const skip = (page - 1) * limit;

//     // Fetch products with pagination
//     const [products, total] = await Promise.all([
//       Product.find({})
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .select('-__v'),
//       Product.countDocuments()
//     ]);

//     return NextResponse.json({
//       success: true,
//       count: products.length,
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//       data: products
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return NextResponse.json({
//       success: false,
//       message: "Error fetching products",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     }, { status: 500 });
//   }
// }

export async function GET(request) {
  // const session = await getSession();
  // console.log(session)
  try {
    await dbConnect();

    // Authentication
    const authHeader = request.headers.get("authorization");
    console.log("60 line ",authHeader)
    const token = authHeader?.split(" ")[1];
     console.log("60 line ",token)
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    console.log(user);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query filter - only get products created by this user
    const filter = { creatorId: decoded._id };

    // Optional: Add search functionality
    const search = searchParams.get('search');
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Product.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
   await dbConnect();
    
    // Authentication
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Validate input
    const body = await request.json();
    // console.log(body);
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (name, category, price)" },
        { status: 400 }
      );
    }

    // ========== NEW PRODUCT CODE GENERATION LOGIC ==========
    // Find the last product to determine next code
    const lastProduct = await Product.findOne().sort({ productCode: -1 }).limit(1);
    
    let nextProductCode;
    if (!lastProduct) {
      // If no products exist, start with PRO_0001
      nextProductCode = "PRO_0001";
    } else {
      // Extract number from last code and increment
      const lastCodeNumber = parseInt(lastProduct.productCode.split('_')[1]);
      const nextNumber = lastCodeNumber + 1;
      nextProductCode = `PRO_${nextNumber.toString().padStart(4, '0')}`;
    }
    // ========== END OF NEW LOGIC ==========


    // Create product
    const productData = new Product({
      ...body,
      creatorId: user._id,
      productCode: nextProductCode, // Now setting it explicitly
      // productCode will be auto-generated by pre-save hook
    });
    // console.log("rebuuild",product);

    const product = new Product(productData);
    await product.save();

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
    
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate product code' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
