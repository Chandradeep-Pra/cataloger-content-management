// app/api/webhooks/user-created/route.ts
import { NextRequest, NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import {User} from "@/models/users.model";



export async function POST(req: NextRequest) {
    const body = await req.json();

    const { id, email_addresses, first_name, last_name, profile_image_url, username , phone_numbers} = body.data;

    await dbConnect();
    try {
        await User.create ({
        clerkId: id,
        username: username,
        email: email_addresses[0].email_address,
        fullname: `${first_name} ${last_name}`,
        categories: [],
        avatar: profile_image_url,
        phone: phone_numbers,
        password: "",
        });
    
        return NextResponse.json({
        success:true,
        message:"User created successfully and saved in database"
        },{status:200})
    } catch (error) {
        console.error("Error saving user in database",error);
        return NextResponse.json({
            success: false,
            message:"Error creating user and saving in database"
            },{status:500})

    }
}
