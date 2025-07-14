import mongoose, { Schema, Document } from "mongoose";

export interface Category extends Document {
  owner: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  name: string;
  description: string;
  isPublic?: boolean;
  level?: number;
  parent?:Category;
  children?: Category[];
  parentId?: mongoose.Types.ObjectId;
  childrenId?: mongoose.Types.ObjectId[]; // fixed to array
  categoryImageIds: string[]; // cloudinary ids or similar
  productCount: number;
}

const categorySchema = new Schema<Category>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    childrenId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: [],
      },
    ],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0,
    },
    categoryImageIds: {
      type: [String], 
      required: true,
      default: [],
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category || mongoose.model<Category>("Category", categorySchema);
