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
      
      // Debug: Log the entire body
      console.log('RECEIVED BODY:', JSON.stringify(body, null, 2));
      
      const {name, description, isPublic, level, parentId, categoryImageId, productCount} = body;
      
      // Debug: Log each field individually
      // console.log('name:', name);
      // console.log('description:', description);
      // console.log('categoryImageId:', categoryImageId);
      // console.log('categoryImageId type:', typeof categoryImageId);
      // console.log('categoryImageId length:', categoryImageId?.length);
      
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
          categoryImageId: categoryImageId,
          productCount
      })
      
      // console.log('About to save category with categoryImageId:', newCategory.categoryImageId);
      
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
          message: "Category created successfully",
          categoryImageId: categoryImageId // Include in response for debugging
      },{ status:200 })

  } catch (error) {
      console.log("Error creating category", error);
      return NextResponse.json({
          success: false,
          message: "Category creation failed"
      }, {status: 400})
  }
}

export async function DELETE(req: Request){
    const { userId } = await auth();
    console.log("User Id", userId);
    
    if (!userId) {
    return new Response("Unauthorized acess", { status: 401 });
}
    await dbConnect();
    try {
      const body = await req.json()
      console.log("RECEIVED BODY", body);
      const {id} = body
      
      // const {id} = body  
      if(!id){
        console.log("Missing category id");
        return NextResponse.json({
            success: false,
            message: "Category not found"
        },{status:401})
      }
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
          return NextResponse.json({
              success: false,
              message: "User not found"
          }, { status: 404 });
      }
       // Check if category exists and belongs to the user
       const categoryToDelete = await Category.findOne({ 
        _id: id, 
        owner: user._id 
    });

    if (!categoryToDelete) {
        return NextResponse.json({
            success: false,
            message: "Category not found or unauthorized"
        }, { status: 404 });
    }

    // Remove from parent's children array if it has a parent
    if (categoryToDelete.parentId) {
        await Category.findByIdAndUpdate(categoryToDelete.parentId, {
            $pull: { children: id }
        });
    }

    // Remove from user's categories array
    await User.findByIdAndUpdate(user._id, {
        $pull: { categories: id }
    });

    // Delete the category
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete category"
        }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: "Category deleted successfully"
    }, { status: 200 }); // Use 200 for successful deletion
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
      // const categories = await Category.find({ owner: user._id }).lean();
      const categories = await  Category.find({owner: user._id})
  
      // Step 2: Build nested tree
      const categoryMap = new Map();
      let roots: any[] = [];
  
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

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { categoryId, name, description, isPublic, level, parentId, categoryImageId } = body;

    if (!categoryId || !name || !description) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      }, { status: 400 });
    }

    const owner = await User.findOne({ clerkId: userId });
    if (!owner) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const category = await Category.findOne({ _id: categoryId, owner: owner._id });
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found or unauthorized" },
        { status: 404 }
      );
    }

    category.name = name;
    category.description = description;
    category.isPublic = isPublic;
    category.level = level;
    category.parentId = parentId;
    category.categoryImageId = categoryImageId;

    await category.save();

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update category",
    }, { status: 500 });
  }
}
