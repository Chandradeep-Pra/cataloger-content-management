import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Category } from "@/models/category.model";
import { Product } from "@/models/product.model";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    const { slug } = params;
    
    const category = await Category.findOne({ slug, isPublic: true })
      .populate('children')
      .lean();
    
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Get products for this category
    const products = await Product.find({ 
      category: category._id, 
      isActive: true 
    }).lean();

    return NextResponse.json({
      success: true,
      category,
      products
    });
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch category"
    }, { status: 500 });
  }
}