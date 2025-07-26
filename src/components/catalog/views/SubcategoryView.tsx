'use client';

import React from 'react';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderTree } from 'lucide-react';
import Link from 'next/link';

interface SubcategoryViewProps {
  category: Category;
  products: Product[];
}

export function SubcategoryView({ category, products }: SubcategoryViewProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {category.description}
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Level {category.level}</Badge>
            <Badge variant="outline">{products.length} Products</Badge>
          </div>
        </div>

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FolderTree className="h-6 w-6" />
              Subcategories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.children.map((child) => (
                <Link key={child._id.toString()} href={`/category/${child.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      {child.categoryImageId && (
                        <div className="aspect-video rounded-md overflow-hidden mb-4">
                          <img
                            src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${child.categoryImageId}.png`}
                            alt={child.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardTitle className="flex items-center justify-between">
                        {child.name}
                        <Badge variant="outline">{child.productCount || 0}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {child.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Image */}
        {category.categoryImageId && (
          <div className="mb-12 rounded-lg overflow-hidden">
            <img
              src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${category.categoryImageId}.png`}
              alt={category.name}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id.toString()} product={product} />
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && (!category.children || category.children.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No content found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}