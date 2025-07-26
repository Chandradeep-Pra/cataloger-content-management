import mongoose, { Schema, Document } from "mongoose";

export interface Product extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  sku?: string; 
  category: string;
  productImageIds: string[]; 
  isActive: boolean;
  tags?: string[];
  colors: string[];
  sizes: Array<"s" | "m" | "l" | "xl" | "xxl" | "xxxl" | "custom">; 
}


const productSchema: Schema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    sku: {
      type: String, 
      unique: true,
      // required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productImageIds: [
      {
        type: String,
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    colors: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    sizes: [
      {
        type: String,
        enum: ["s", "m", "l", "xl", "xxl", "xxxl", "custom"],
      },
    ],
  },
  { timestamps: true }
);


export const Product =  mongoose.models.Product || mongoose.model<Product>("Product", productSchema);
