'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/models/category.model';
// import { dataService } from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import dbConnect from '@/lib/dbConnect';
// import dbConnect from '@/lib/dbConnect';


interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSuccess: () => void;
  categories: Category[];
}

export function CategoryFormDialog({ open, onOpenChange, category, onSuccess, categories }: CategoryFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    level: 1,
    parentId: '',
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        isPublic: category.isPublic ?? true,
        level: category.level ?? 1,
        parentId: category.parentId?.toString() || '',
        images: category.categoryImageIds ? category.categoryImageIds : []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isPublic: true,
        level: 1,
        parentId: '',
        images: []
      });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        level: formData.level,
        parentId: formData.parentId || undefined,
        categoryImageIds: formData.images,
        childrenId: []
      };
      console.log("Submit Data:", submitData);
      // await dbConnect()
      if (category) {
        try {
            const res = await fetch('/api/category',{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId: category._id, ...submitData })
            })
            const json = await res.json();
            toast.success('Category updated successfully');
            if (!res.ok) throw new Error(json.message || 'Failed to update');
        } catch (error) {
            toast.error("Failed to update category")
        }
      } else {
        // await dbConnect()
        try {
            try {
              const res = await fetch('/api/category', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(submitData)
                });      
                const json = await res.json();
                toast.success('Category created successfully');
              onSuccess();
            } catch (error) {
              // if (!res.ok) throw new Error(json.message || 'Failed to create');
              toast.error("Problem creating category")
              
            }
        } catch (error) {
            toast.error("Failed to create category")
        }

      }
      
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const availableParents = categories.filter(cat => 
    cat.id !== category?.id && 
    (cat.level ?? 1) < formData.level &&
    !cat.parentId // Only show root categories as potential parents for now
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create Category'}
          </DialogTitle>
          <DialogDescription>
            {category ? 'Update category information' : 'Add a new category to your inventory'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category Image</Label>
            <FileUpload
              value={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              maxFiles={5}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select 
                value={formData.level.toString()} 
                onValueChange={(value) => setFormData({ ...formData, level: parseInt(value), parentId: '' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.level > 1 && (
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category</Label>
                <Select 
                  value={formData.parentId} 
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableParents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
            <Label htmlFor="isPublic">Public Category</Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || formData.images.length === 0} onSubmit={handleSubmit} >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}