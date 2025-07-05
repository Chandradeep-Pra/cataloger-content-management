'use client';

import React from 'react';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Badge } from '@/components/ui/badge';

interface BannerGridViewProps {
  category: Category;
  products: Product[];
}

export function BannerGridView({ category, products }: BannerGridViewProps) {
  const columns = category.layout.columns || 3;
  
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-96 bg-gradient-to-r from-primary/20 to-secondary/20">
        {category.categoryImageId ? (
          <img
            src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${category.categoryImageId}.png`}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20" />
        )}
        
        {/* Banner Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl max-w-2xl mx-auto mb-6">
              {category.description}
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Level {category.level}
              </Badge>
              <Badge variant="outline" className="border-white/40 text-white">
                {products.length} Products
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
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
    </div>
  );
}