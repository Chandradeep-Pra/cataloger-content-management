'use client';

import React from 'react';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface CarouselGridViewProps {
  category: Category;
  products: Product[];
}

export function CarouselGridView({ category, products }: CarouselGridViewProps) {
  const featuredProducts = products.slice(0, 8);
  const remainingProducts = products.slice(8);
  const columns = category.layout.columns || 3;
  
  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            {category.description}
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Level {category.level}</Badge>
            <Badge variant="outline">{products.length} Products</Badge>
          </div>
        </div>
      </div>

      {/* Featured Carousel */}
      {featuredProducts.length > 0 && (
        <div className="mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-6 px-4">
              {featuredProducts.map((product) => (
                <div key={product._id.toString()} className="flex-none w-80">
                  <ProductCard product={product} featured />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Category Image */}
      {category.categoryImageId && (
        <div className="container mx-auto px-4 mb-12">
          <div className="rounded-lg overflow-hidden">
            <img
              src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${category.categoryImageId}.png`}
              alt={category.name}
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      )}

      {/* Remaining Products Grid */}
      {remainingProducts.length > 0 && (
        <div className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-semibold mb-6">All Products</h2>
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
            {remainingProducts.map((product) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}