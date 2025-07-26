'use client';

import React from 'react';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Badge } from '@/components/ui/badge';

interface LookbookViewProps {
  category: Category;
  products: Product[];
}

export function LookbookView({ category, products }: LookbookViewProps) {
  // Split products into chunks for lifestyle sections
  const productChunks = [];
  const chunkSize = 4;
  for (let i = 0; i < products.length; i += chunkSize) {
    productChunks.push(products.slice(i, i + chunkSize));
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        {category.categoryImageId ? (
          <img
            src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${category.categoryImageId}.png`}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30" />
        )}
        
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-light mb-6">{category.name}</h1>
            <p className="text-2xl font-light max-w-3xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Lookbook Sections */}
      {productChunks.map((chunk, index) => (
        <div key={index} className="py-16">
          <div className="container mx-auto px-4">
            {index % 2 === 0 ? (
              // Left-aligned section
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-light">
                    {category.layout.sectionTitle || `Collection ${index + 1}`}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {chunk.map((product) => (
                      <ProductCard key={product._id.toString()} product={product} compact />
                    ))}
                  </div>
                </div>
                <div className="aspect-square bg-muted rounded-lg">
                  {chunk[0]?.productImageid[0] && (
                    <img
                      src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${chunk[0].productImageid[0]}.png`}
                      alt="Lifestyle"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ) : (
              // Right-aligned section
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-square bg-muted rounded-lg order-2 lg:order-1">
                  {chunk[0]?.productImageid[0] && (
                    <img
                      src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${chunk[0].productImageid[0]}.png`}
                      alt="Lifestyle"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h2 className="text-3xl font-light">
                    {category.layout.sectionTitle || `Collection ${index + 1}`}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {chunk.map((product) => (
                      <ProductCard key={product._id.toString()} product={product} compact />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}