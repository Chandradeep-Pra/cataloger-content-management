
export interface DashboardStats {
    totalCategories: number;
    totalProducts: number;
    publicCategories: number;
    privateCategories: number;
    activeProducts: number;
    inactiveProducts: number;
  }
  
  export interface CategoryFormData {
    name: string;
    description: string;
    isPublic: boolean;
    level: number;
    parentId?: string;
    categoryImageIds?: string[];
  }
  
 export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  productImageIds: string[];
  isActive: boolean;
  colors: string[];
  sizes: Array<"s" | "m" | "l" | "xl" | "xxl" | "xxxl" | "custom">;
}
