import { dbConnect } from "@/app/lib/dbConnect";
import Product from "@/app/models/Product";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// import { generateToken } from '@/app/lib/jwt';

export async function GET(request) {
  try {
    await dbConnect();

    // Fetch all products from the database
    const products = await Product.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('-__v'); // Exclude the __v field

    return NextResponse.json(
      { 
        success: true, 
        count: products.length, 
        data: products 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Error fetching products",
        error: error.message // Include error message for debugging
      },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request) {
  try {
    await dbConnect();
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    // console.log('token from api', token);

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select("-password");
    // console.log('user', user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    // console.log(body);

    const productData = {
      ...body,
      creatorCode: user.userId, // Store the user ID from the token
      createdAt: new Date(),
      updatedAt: new Date(),
      //   price: parseFloat(body.price) // Ensure price is a number
    };
    console.log(productData);

    const products = new Product(productData);
    await products.save();

    return NextResponse.json(
      { success: true, count: products.length, data: products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from 'next/server';
// import Product from '@/models/Product';
// import dbConnect from '@/utils/dbConnect';

// // GET all products with filtering and pagination
// export async function GET(request) {
//   try {
//     await dbConnect();

//     // Get query parameters from URL
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 20;
//     const category = searchParams.get('category');
//     const search = searchParams.get('search');
//     const minPrice = parseFloat(searchParams.get('minPrice'));
//     const maxPrice = parseFloat(searchParams.get('maxPrice'));
//     const sort = searchParams.get('sort') || '-createdAt';

//     // Build query object
//     const query = {};
    
//     if (category) query.category = category;
//     if (search) query.name = { $regex: search, $options: 'i' };
//     if (minPrice || maxPrice) {
//       query.sellingPrice = {};
//       if (minPrice) query.sellingPrice.$gte = minPrice;
//       if (maxPrice) query.sellingPrice.$lte = maxPrice;
//     }

//     // Get total count for pagination
//     const total = await Product.countDocuments(query);

//     // Fetch products with filters
//     const products = await Product.find(query)
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .select('-__v')
//       .populate('createdBy', 'name email') // Populate creator info
//       .lean();

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
//     return NextResponse.json(
//       { 
//         success: false,
//         message: "Error fetching products",
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }
