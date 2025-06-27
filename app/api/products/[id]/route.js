import { dbConnect } from '@/app/lib/dbConnect';
import Product from '@/app/models/Product';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET single product
export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const product = await Product.findById(params.id)
      .select('-__v') // Exclude version key
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Convert MongoDB document to plain object
    const formattedProduct = {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request, { params }) {
  try {
    // const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    console.log(body);
    
    // Basic validation
    // if (!body.name || !body.sellingPrice) {
    //   return NextResponse.json(
    //     { success: false, message: 'Name and selling price are required' },
    //     { status: 400 }
    //   );
    // }

    // const updateData = {
    //   ...body,
    //   updatedAt: new Date(),
    //   updatedBy: token.sub, // Track who updated the product
    //   sellingPrice: parseFloat(body.sellingPrice)
    // };

    // // Find and update the product
    // const updatedProduct = await Product.findByIdAndUpdate(
    //   params.id,
    //   updateData,
    //   { new: true, runValidators: true }
    // ).select('-__v').lean();

    // if (!updatedProduct) {
    //   return NextResponse.json(
    //     { success: false, message: 'Product not found' },
    //     { status: 404 }
    //   );
    // }
    
    // // Convert MongoDB document to plain object
    // const formattedProduct = {
    //   ...updatedProduct,
    //   _id: updatedProduct._id.toString(),
    //   createdAt: updatedProduct.createdAt?.toISOString(),
    //   updatedAt: updatedProduct.updatedAt?.toISOString()
    // };

    // return NextResponse.json({
    //   success: true,
    //   data: formattedProduct
    // });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error updating product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// // DELETE product
export async function DELETE(request, { params }) {
  try {
    console.log(params.id);
    // const token = await getToken({ req: request });
    
    // if (!token) {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // await dbConnect();
    
    // // Validate ID format
    // if (!ObjectId.isValid(params.id)) {
    //   return NextResponse.json(
    //     { success: false, message: 'Invalid product ID format' },
    //     { status: 400 }
    //   );
    // }

    // // Find and delete the product
    // const deletedProduct = await Product.findByIdAndDelete(params.id);

    // if (!deletedProduct) {
    //   return NextResponse.json(
    //     { success: false, message: 'Product not found' },
    //     { status: 404 }
    //   );
    // }

    // // Log the deletion activity
    // await ActivityLog.create({
    //   action: 'delete',
    //   collection: 'products',
    //   documentId: params.id,
    //   userId: token.sub,
    //   metadata: {
    //     productName: deletedProduct.name,
    //     productCode: deletedProduct.productCode
    //   }
    // });

    // return NextResponse.json(
    //   { 
    //     success: true,
    //     message: 'Product deleted successfully',
    //     data: {
    //       id: params.id,
    //       productCode: deletedProduct.productCode
    //     }
    //   },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error deleting product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}