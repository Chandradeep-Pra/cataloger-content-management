"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProductFormData } from "@/types/index ";
import { ColorPicker } from "../ColorPicker";
import TagsInput from "../TagsInput";

interface ProductFormDialogProps {
  category: object;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  product?: ProductFormData | null;
}

export function ProductFormDialog({
  category,
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    sku: "",
    categoryId: category.id,
    productImageIds: [],
    isActive: true,
    tags: [],
    colors: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        sku: "",
        categoryId: category.id,
        productImageIds: [],
        isActive: true,
        colors: [],
        tags: [],
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: product?._id }),
      });

      if (!res.ok) throw new Error("Something went wrong");
      toast.success(product ? "Product updated" : "Product created");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogDescription>
            {product ? "Update product details" : "Add a new product"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
            </div>

            {/* <div className="space-y-2">
              <Label>Category</Label>
              <Input value={category.name} disabled />
            </div> */}
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <FileUpload
              value={formData.productImageIds}
              onChange={(val) =>
                setFormData({ ...formData, productImageIds: val })
              }
              maxFiles={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Colors</Label>
              <ColorPicker
                colors={formData.colors}
                onChange={(val) => setFormData({ ...formData, colors: val })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagsInput
                tags={formData.tags || []}
                onChange={(tags) => setFormData({ ...formData, tags })}
              />
            </div>

            {/* <div className="space-y-2">
              <Label>Sizes</Label>
              <Input
                placeholder="e.g. s, m, l"
                value={formData.sizes.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sizes: e.target.value.split(',').map((s) => s.trim().toLowerCase())
                  })
                }
              />
            </div> */}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <span>{formData.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
