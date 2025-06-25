import clientPromise from '@/lib/db/connect';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getToken } from 'next-auth/jest';

// GET single product
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(params.id) });
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request, { params }) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.price) {
      return NextResponse.json(
        { message: 'Name and price are required' },
        { status: 400 }
      );
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
      updatedBy: token.sub, // Track who updated the product
      price: parseFloat(body.price)
    };

    const result = await db
      .collection('products')
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: updateData }
      );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    const updatedProduct = await db
      .collection('products')
      .findOne({ _id: new ObjectId(params.id) });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Error updating product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(request, { params }) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    const result = await db
      .collection('products')
      .deleteOne({ _id: new ObjectId(params.id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 }
    );
  }
}