import { z } from "zod";

export const categorySchema = z.object({
  owner: z.string().min(1, "Owner ID is required"),
  products: z.array(z.string()).optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(8, "Description is required"),
  isPublic: z.boolean().optional().default(false),
  level: z.number().nonnegative().default(0),
  parentId: z.string().optional(), 
  categoryImageIds: z.array(z.string()).min(1, "At least one image is required")
});
