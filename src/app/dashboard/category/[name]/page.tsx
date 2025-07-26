"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X } from "lucide-react";
import { SearchAndFilter } from "@/components/SearchAndFilter"; // ✅ Make sure path is correct
import { ProductFormDialog } from "@/components/product/product-from-dialog";
import { Product } from "@/models/product.model";
import ProductList from "@/components/product/product-list";

type Category = {
  _id: string;
  name: string;
  description?: string;
  level: number;
  isPublic: boolean;
  productCount: number;
  categoryImageIds: string[];
  createdAt: string;
  updatedAt: string;
};

export default function CategoryPage({ params }: { params: { name: string } }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(
    null
  );
  const router = useRouter();

  // 🔍 Product filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // 🛠️ Dialog states
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/category/${id}`);
      if (!res.ok) throw new Error("Failed to fetch category");
      const data = await res.json();
      if (!data?.category) throw new Error("Not found");
      setCategory(data.category);
      // console.log(data.category)
    } catch (err) {
      console.error("Category load error:", err);
      router.push("/not-found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory(params.name);
  }, [params.name]);

  const handleImageClick = (index: number) => {
    setExpandedImageIndex((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          {[1, 2].map((_, i) => (
            <Skeleton key={i} className="h-48 w-48 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-80" />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header + Controls */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground text-base max-w-xl">
            {category.description ||
              "No description available for this category."}
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge>{category.isPublic ? "Public" : "Private"}</Badge>
            <Badge variant="outline">Level {category.level}</Badge>
            <Badge variant="secondary">{category.products.length} Products</Badge>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            className="rounded-xl hover:bg-primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            className="rounded-full p-2 hover:scale-110 transition"
            onClick={() => setShowDialog(true)}
          >
            <Plus />
          </Button>
          <ProductFormDialog
            open={showDialog}
            category={{name: category.name, id: category._id}}
            onOpenChange={setShowDialog}
            onSuccess={() => alert("Success from product add")}
          />
        </div>
      </div>

      {/* Search and Filter for Products */}
      <SearchAndFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search products..."
        filters={[
          {
            key: "availability",
            label: "Availability",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All", value: "all" },
              { label: "In Stock", value: "in_stock" },
              { label: "Out of Stock", value: "out_of_stock" },
            ],
          },
          {
            key: "price",
            label: "Price",
            value: priceFilter,
            onChange: setPriceFilter,
            options: [
              { label: "All", value: "all" },
              { label: "Under $50", value: "under_50" },
              { label: "$50–$100", value: "50_100" },
              { label: "Over $100", value: "over_100" },
            ],
          },
        ]}
      />

      {/* Products Placeholder */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Products in this Category</h2>
        <ProductList
  categoryId={category._id}
  searchTerm={searchTerm}
  statusFilter={statusFilter}
  priceFilter={priceFilter}
/>

        {/* <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
          Product list coming soon.
        </div> */}
      </div>

      {/* Metadata / Timestamp */}
      <div className="text-sm text-muted-foreground mt-8">
        <p>Created at: {new Date(category.createdAt).toLocaleDateString()}</p>
        <p>Last updated: {new Date(category.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
