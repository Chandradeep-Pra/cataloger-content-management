'use client';

import React from 'react';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Badge } from '@/components/ui/badge';

interface GridViewProps {
  category: Category;
  products: Product[];
}

export function GridView({ category, products }: GridViewProps) {
  const columns = category.layout.columns || 3;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {category.description}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="secondary">Level {category.level}</Badge>
          <Badge variant="outline">{products.length} Products</Badge>
        </div>
      </div>

      {/* Category Image */}
      {category.categoryImageId && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${category.categoryImageId}.png`}
            alt={category.name}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div 
          className={`grid gap-6 ${
            columns === 1 ? 'grid-cols-1' :
            columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
            columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            columns === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
            columns === 5 ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5' :
            'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
          }`}
        >
          {products.map((product) => (
            <ProductCard key={product._id.toString()} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}