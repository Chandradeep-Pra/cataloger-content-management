import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { Category } from "@/models/category.model";
import { User } from "@/models/users.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await dbConnect();

  try {
    console.log("Checking cat user")
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    console.log("Checking cat data")

    const category = await Category.findOne({
      _id: params.id,
      owner: user._id,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Error in GET /api/category/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
