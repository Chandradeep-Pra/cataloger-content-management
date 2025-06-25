import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/users.model";
import { Webhook } from "svix";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ success: false, message: "Missing Clerk webhook secret" }, { status: 500 });
  }

  // Clerk sends raw payload for signature verification
  const payload = await req.text();
  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";

  const wh = new Webhook(WEBHOOK_SECRET);

  interface ClerkUserCreatedEvent {
    data: {
      id: string;
      email_addresses: { email_address: string }[];
      first_name: string;
      last_name: string;
      profile_image_url: string;
      username: string;
      phone_numbers: { phone_number: string }[]; // You can type more strictly if needed
    };
    object: string;
    type: string;
  }

  let evt: ClerkUserCreatedEvent ;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkUserCreatedEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
  }

  const { id, email_addresses, first_name, last_name, profile_image_url, username, phone_numbers,  } =  evt.data;

  await dbConnect();

  try {
    const existingUser = await User.findOne({ clerkId: id });

    if (existingUser) {
      return NextResponse.json({ success: true, message: "User already exists" }, { status: 200 });
    }

    await User.create({
      clerkId: id,
      username: username || "",
      email: email_addresses?.[0]?.email_address || "",
      fullName: `${first_name} ${last_name }`.trim(),
      avatar: profile_image_url || "",
      phone: phone_numbers?.[0]?.phone_number || "",
      categories: [],
    });

    return NextResponse.json({
      success: true,
      message: "User created and saved in database",
    },{status:200});
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to save user in database",
    }, { status: 500 });
  }
}
