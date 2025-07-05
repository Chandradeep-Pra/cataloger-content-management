'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { GridView } from '@/components/catalog/views/GridView';
import { BannerGridView } from '@/components/catalog/views/BannerGridView';
import { LookbookView } from '@/components/catalog/views/LookbookView';
import { StoryView } from '@/components/catalog/views/StoryView';
import { CarouselGridView } from '@/components/catalog/views/CarouselGridView';
import { SubcategoryView } from '@/components/catalog/views/SubcategoryView';
import { RichTextView } from '@/components/catalog/views/RichTextView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Eye, EyeOff, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryWithProducts extends Category {
  products: Product[];
}

export default function PreviewPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadPreviewData();
  }, []);

  const loadPreviewData = async () => {
    try {
      setLoading(true);
      
      // Fetch public categories
      const categoriesRes = await fetch('/api/categories');
      const categoriesData = await categoriesRes.json();
      
      if (!categoriesData.success) {
        throw new Error('Failed to fetch categories');
      }

      // Filter public categories and sort by layout order
      const publicCategories = categoriesData.categories
        .filter((cat: Category) => cat.isPublic && cat.layout.homepageSection)
        .sort((a: Category, b: Category) => a.layout.layoutOrder - b.layout.layoutOrder);

      // Fetch products for each category
      const categoriesWithProducts = await Promise.all(
        publicCategories.map(async (category: Category) => {
          try {
            const productsRes = await fetch(`/api/products?categoryId=${category._id}`);
            const productsData = await productsRes.json();
            
            return {
              ...category,
              products: productsData.success ? productsData.products : []
            };
          } catch (error) {
            console.error(`Error fetching products for category ${category._id}:`, error);
            return {
              ...category,
              products: []
            };
          }
        })
      );

      setCategories(categoriesWithProducts);
    } catch (error) {
      console.error('Error loading preview data:', error);
      toast.error('Failed to load preview data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately
    setCategories(items);

    // Update layout orders
    const reorderedCategories = items.map((category, index) => ({
      id: category._id,
      layoutOrder: index
    }));

    try {
      const res = await fetch('/api/categories/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorderedCategories })
      });

      if (!res.ok) {
        throw new Error('Failed to reorder categories');
      }

      toast.success('Categories reordered successfully');
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error('Failed to reorder categories');
      // Revert local state on error
      loadPreviewData();
    }
  };

  const renderCategoryView = (category: CategoryWithProducts) => {
    const props = { category, products: category.products };
    
    switch (category.layout.viewType) {
      case 'grid':
        return <GridView {...props} />;
      case 'banner-grid':
        return <BannerGridView {...props} />;
      case 'lookbook':
        return <LookbookView {...props} />;
      case 'story':
        return <StoryView {...props} />;
      case 'carousel-grid':
        return <CarouselGridView {...props} />;
      case 'subcategory':
        return <SubcategoryView {...props} />;
      case 'rich-text':
        return <RichTextView {...props} />;
      default:
        return <GridView {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Site Preview</h1>
              <p className="text-sm text-muted-foreground">
                {categories.length} sections • {isEditMode ? 'Edit Mode' : 'Preview Mode'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isEditMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                <Settings className="h-4 w-4 mr-1" />
                {isEditMode ? 'Exit Edit' : 'Edit Layout'}
              </Button>
              <Button variant="outline" size="sm" onClick={loadPreviewData}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      {categories.length === 0 ? (
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">
            No public categories with homepage sections found.
          </p>
        </div>
      ) : isEditMode ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {categories.map((category, index) => (
                  <Draggable
                    key={category._id.toString()}
                    draggableId={category._id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
                      >
                        {/* Drag Handle */}
                        <div className="sticky top-20 z-40 bg-background/95 backdrop-blur border-b border-t">
                          <div className="container mx-auto px-4 py-2">
                            <div className="flex items-center gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="outline">#{index + 1}</Badge>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{category.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="secondary">{category.layout.viewType}</Badge>
                                  <span>{category.products.length} products</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {category.isPublic ? (
                                  <Eye className="h-4 w-4 text-green-500" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Category Content */}
                        <div className="border-l-4 border-primary/20">
                          {renderCategoryView(category)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div>
          {categories.map((category) => (
            <div key={category._id.toString()}>
              {renderCategoryView(category)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}