import mongoose, { Schema, Document } from "mongoose";

export interface Product extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  sku?: string; 
  category: string;
  productImageIds: string[]; 
  isActive: boolean;
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
    },
    price: {
      type: Number,
      required: true,
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
