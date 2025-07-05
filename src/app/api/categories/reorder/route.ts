import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Category } from "@/models/category.model";
import { User } from "@/models/users.model";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { reorderedCategories } = body; // Array of { id, layoutOrder }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Bulk update layout orders
    const updatePromises = reorderedCategories.map(({ id, layoutOrder }: { id: string, layoutOrder: number }) =>
      Category.findOneAndUpdate(
        { _id: id, owner: user._id },
        { 'layout.layoutOrder': layoutOrder }
      )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Categories reordered successfully"
    });
  } catch (error) {
    console.error("Error reordering categories:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to reorder categories"
    }, { status: 500 });
  }
}