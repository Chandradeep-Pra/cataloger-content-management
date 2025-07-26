'use client';

import React from 'react';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface StoryViewProps {
  category: Category;
  products: Product[];
}

export function StoryView({ category, products }: StoryViewProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>
      </div>

      {/* Story Cards - Horizontal Scroll */}
      <div className="mb-12">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            {products.map((product, index) => (
              <div
                key={product._id.toString()}
                className="flex-none w-64 h-96 rounded-lg overflow-hidden relative group cursor-pointer"
              >
                {product.productImageid[0] ? (
                  <img
                    src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${product.productImageid[0]}.png`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
                
                {/* Story Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm opacity-90">${product.price}</p>
                  </div>
                </div>

                {/* Story Number */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Featured Products Grid */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product._id.toString()} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}