import { dbConnect } from "@/app/lib/dbConnect";
import Supplier from "@/app/models/Supplier";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    // console.log(body)
    
    // Input validation
    // if (!body.name || typeof body.name !== 'string') {
    //   return NextResponse.json(
    //     { error: 'Category name is required and must be a string' },
    //     { status: 400 }
    //   );
    // }

    // Check if category already exists
    // const existingCategory = await Categories.findOne({ name: body.name });
    // if (existingCategory) {
    //   return NextResponse.json(
    //     { error: 'Category already exists' },
    //     { status: 409 }
    //   );
    // }

    // Create slug from name
    // const slug = body.name.toLowerCase().replace(/\s+/g, '-');
    
    const supplier = new Supplier({
      name: body,
    //   slug
    });
    // console.log(supplier)

    await supplier.save();
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          name: supplier.name,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    const suppliers = await Supplier.find({}); // Only include necessary fields
      // Alternatively: .select('name slug createdAt') to explicitly select fields

    return NextResponse.json(
      { 
        success: true, 
        count: suppliers.length, 
        data: suppliers 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch suppliers',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
