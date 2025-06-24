import mongoose, { Schema, Document } from "mongoose";

export interface Category extends Document {
  owner: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  name: string;
  description: string;
  isPublic?: boolean;
  level?: number;
  parentId?: mongoose.Types.ObjectId
  childrenId?: mongoose.Types.ObjectId
  categoryImageId: string 
}

const categorySchema: Schema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null
      },
    ],
    parentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    childrenId:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0,
    },
    categoryImageId:{
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Category =  mongoose.models.Category || mongoose.model<Category>("Category", categorySchema);
