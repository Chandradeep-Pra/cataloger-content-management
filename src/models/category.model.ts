import mongoose, { Schema, Document } from "mongoose";

export type CategoryViewType =
  | 'grid'
  | 'banner-grid'
  | 'lookbook'
  | 'story'
  | 'carousel-grid'
  | 'subcategory'
  | 'rich-text';

export interface CategoryLayout {
  viewType: CategoryViewType;
  layoutOrder: number;
  homepageSection?: boolean;
  sectionTitle?: string;
  columns?: number;
}

export interface Category extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  name: string;
  slug: string;
  description: string;
  isPublic?: boolean;
  level?: number;
  parentId?: mongoose.Types.ObjectId;
  categoryImageId?: string;
  children?: Category[];
  productCount?: number;
  layout: CategoryLayout;
}

const categoryLayoutSchema = new Schema({
  viewType: {
    type: String,
    enum: ['grid', 'banner-grid', 'lookbook', 'story', 'carousel-grid', 'subcategory', 'rich-text'],
    default: 'grid'
  },
  layoutOrder: {
    type: Number,
    default: 0
  },
  homepageSection: {
    type: Boolean,
    default: false
  },
  sectionTitle: {
    type: String
  },
  columns: {
    type: Number,
    default: 3,
    min: 1,
    max: 6
  }
});

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
        default: []
      },
    ],
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 1,
    },
    categoryImageId: {
      type: String
    },
    productCount: {
      type: Number,
      default: 0
    },
    layout: {
      type: categoryLayoutSchema,
      default: () => ({
        viewType: 'grid',
        layoutOrder: 0,
        homepageSection: false,
        columns: 3
      })
    }
  },
  { timestamps: true }
);

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export const Category = mongoose.models.Category || mongoose.model<Category>("Category", categorySchema);