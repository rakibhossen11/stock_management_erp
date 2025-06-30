import { dbConnect } from "@/app/lib/dbConnect";
import Categories from "@/app/models/Categories";
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
    
    const category = new Categories({
      name: body,
    //   slug
    });
    // console.log(category)

    await category.save();
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          _id: category._id,
          name: category.name,
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
    
    const categories = await Categories.find({}); // Only include necessary fields
      // Alternatively: .select('name slug createdAt') to explicitly select fields

    return NextResponse.json(
      { 
        success: true, 
        count: categories.length, 
        data: categories 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
