import { auth } from "@clerk/nextjs/server";
import  dbConnect  from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Product } from "@/models/product.model";
import { User } from "@/models/users.model";

import { Category } from "@/models/category.model";

export async function POST(req: Request){
    const {userId} = await auth()
    if(!userId){
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, {status: 401})
    }
    dbConnect();
    try {
        const body  = await req.json()
        const {name, description, price, sku, productImageId, categoryId} = body;
        if(!name || !description || !price || !sku || !categoryId){
            console.log("Could not get values for all the fields");
            return NextResponse.json({
                success:false,
                message: "Could not get values for all the fields"
            }, { status: 501 })
        }
        const owner = User.findOne({clerkId: userId})
        if (!owner) {
            return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
            );
        }
        const newProduct = new Product({
            owner,
            name,
            description,
            price,
            sku,
            category: categoryId,
            productImageId
        })
        await newProduct.save()
        
        await Category.findByIdAndUpdate(categoryId,{
            $push: { products: newProduct._id },
        })

        return NextResponse.json({
            success: true,
            message: "Product listed successfully"
        }, {status:200})

    } catch (error) {
        console.error("Error posting product", error)
        return NextResponse.json({
            success: false,
            message: "Error posting product"
        }, {status: 401})
    }
}

export async function DELETE(req: Request) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  
    await dbConnect();
  
    try {
      const body = await req.json();
      const { productId, categoryId } = body;
  
      if (!productId || !categoryId) {
        return NextResponse.json(
          { success: false, message: "Missing productId or categoryId" },
          { status: 400 }
        );
      }
  
      const deletedProduct = await Product.findOneAndDelete({
        _id: productId,
        owner: (await User.findOne({ clerkId: userId }))?._id,
      });
  
      if (!deletedProduct) {
        return NextResponse.json(
          { success: false, message: "Product not found or not owned by user" },
          { status: 404 }
        );
      }
  
      await Category.findByIdAndUpdate(categoryId, {
        $pull: { products: productId },
      });
  
      return NextResponse.json(
        { success: true, message: "Product deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting product", error);
      return NextResponse.json(
        { success: false, message: "Error deleting product" },
        { status: 500 }
      );
    }
}

export async function GET(req: Request) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  
    await dbConnect();
  
    try {
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
  
      const products = await Product.find({ owner: user._id })
        .populate("category", "name description") // optional: include category name/desc
        .sort({ createdAt: -1 }); // optional: newest first
  
      return NextResponse.json(
        {
          success: true,
          products,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching products", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch products" },
        { status: 500 }
      );
    }
  }