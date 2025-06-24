import { z } from "zod";

export const productSchema = z.object({
  owner: z.string().min(1, "Owner ID is required"), // User ObjectId
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().nonnegative("Price must be 0 or more"),
  sku: z.number().int("SKU must be an integer").nonnegative("SKU must be positive"),
  category: z.string().min(1, "Category ID is required"), // Category ObjectId
});
