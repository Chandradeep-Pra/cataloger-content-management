import { auth } from "@clerk/nextjs/server";
import  dbConnect  from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Category } from "@/models/category.model";
import { User } from "@/models/users.model";


export async function POST(req: Request){
    const { userId } = await auth();
    if (!userId) {
    return new Response("Unauthorized", { status: 401 });
}
    dbConnect();
    try {
        const body = await req.json();
        const {name, description, isPublic, level, parentId, categoryImageId} = body;
        if(!name || !description ){
            return Response.json({
                success:false,
                message: "Could not get name or description"
            }, { status: 501 })
        }

        

        const owner = await User.findOne({clerkId:userId})
        if (!owner) {
            return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
            );
        }
        const newCategory = new Category({
            owner: owner._id,
            products: [],
            name,
            description,
            isPublic,
            level,
            parentId,
            categoryImageId
        })
        await newCategory.save()

        if(parentId){
            await Category.findByIdAndUpdate(parentId, {
                $push: { children: newCategory._id },
            });
        }

        owner.categories?.push(newCategory._id);
        await owner.save();

        return NextResponse.json({
            success: true,
            message: "Category created successfully"
        },{ status:200 })

        }
        catch (error) {
        console.error("Error creating category", error);
        return NextResponse.json({
            success: false,
            message: "Category creation failed"
        }, {status: 400})
    }

}

export async function DELETE(req: Request){
    const { userId } = await auth();
    if (!userId) {
    return new Response("Unauthorized", { status: 401 });
}
    dbConnect();
    try {
      const body = await req.json()
      const {categoryId} = body  
      if(!categoryId){
        console.log("Missing category id");
        return NextResponse.json({
            success: false,
            message: "Category not found"
        },{status:401})
      }
      const deletedCategory = await Category.findByIdAndDelete({categoryId})
      if (!deletedCategory) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Category deleted"
    },{status:201})

    } catch (error) {
        console.error("Error deleting the category", error)
        return NextResponse.json({
            success: false,
            message: "Error deleting the category"
        },{status:401})
    }
}

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    await dbConnect();
  
    try {
      const user = await User.findOne({ clerkId: userId });
  
      // Step 1: Fetch all categories of this user
      const categories = await Category.find({ owner: user._id }).lean();
  
      // Step 2: Build nested tree
      const categoryMap = new Map();
      const roots: any[] = [];
  
      categories.forEach((cat) => {
        cat.children = [];
        categoryMap.set(String(cat._id), cat);
      });
  
      categories.forEach((cat) => {
        if (cat.parentId) {
          const parent = categoryMap.get(String(cat.parentId));
          if (parent) {
            parent.children.push(cat);
          }
        } else {
          roots.push(cat); // Top-level categories
        }
      });
  
      return NextResponse.json({
        success: true,
        categories: roots, // Only root-level with full nested structure
      });
    } catch (error) {
      console.error("Error fetching nested categories:", error);
      return NextResponse.json({
        success: false,
        message: "Failed to fetch categories",
      }, { status: 500 });
    }
}