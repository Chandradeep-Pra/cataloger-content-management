import mongoose, { Schema, Document } from "mongoose";

export interface Product extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: mongoose.Types.ObjectId;
  productImageid: string[];
  isActive: boolean;
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
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productImageid: [
      {
        type: String,
        required: true
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model<Product>("Product", productSchema);