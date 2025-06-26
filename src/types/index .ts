
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
    categoryImageId?: string;
  }
  
  export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    sku: string;
    category: string;
    productImageid: string[];
    isActive: boolean;
  }