import mongoose, { Schema, Document } from "mongoose";

export interface Product extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  sku: number;
  category: string;
  productImageid: string[]

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
      type: Number,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productImageId: [
      {
        type: String,
        required: true
      }
    ]
  },
  { timestamps: true }
);

export const Product =  mongoose.models.Product || mongoose.model<Product>("Product", productSchema);
