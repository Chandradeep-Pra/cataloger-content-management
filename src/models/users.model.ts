import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  clerkId: string;         // Clerk authentication ID
  username: string;
  email: string;
  fullName: string;
  categories: mongoose.Types.ObjectId[]; // Ref to Category
  avatar: string;
  phone: number;
  password: string;
}

const userSchema: Schema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    avatar: {
      type: String,
    },
    phone: {
      type: [String],
    },
    password: {
      type: String,
      required: true
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export const User =  mongoose.models.User || mongoose.model<User>("User", userSchema);