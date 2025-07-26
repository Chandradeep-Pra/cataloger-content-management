'use client';

import React from 'react';
import { Category } from '@/models/category.model';
import { Product } from '@/models/product.model';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Badge } from '@/components/ui/badge';

interface RichTextViewProps {
  category: Category;
  products: Product[];
}

export function RichTextView({ category, products }: RichTextViewProps) {
  // Split products into sections for mixed layout
  const featuredProducts = products.slice(0, 3);
  const remainingProducts = products.slice(3);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 mb-12">
        {category.categoryImageId ? (
          <img
            src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${category.categoryImageId}.png`}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20" />
        )}
        
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
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

      <div className="container mx-auto px-4">
        {/* Rich Text Content */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-xl leading-relaxed text-muted-foreground">
              {category.description}
            </p>
            
            <div className="my-8 p-6 bg-muted rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">About This Collection</h2>
              <p>
                Discover our carefully curated selection of {category.name.toLowerCase()} that combines 
                timeless elegance with contemporary style. Each piece is thoughtfully designed to 
                complement your unique aesthetic and lifestyle.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id.toString()} product={product} featured />
              ))}
            </div>
          </div>
        )}

        {/* Text Block */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Quality & Craftsmanship</h2>
            <p>
              Every item in our {category.name.toLowerCase()} collection represents the pinnacle of 
              quality and attention to detail. We work with skilled artisans and use only the finest 
              materials to ensure that each piece meets our exacting standards.
            </p>
          </div>
        </div>

        {/* Remaining Products */}
        {remainingProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Complete Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {remainingProducts.map((product) => (
                <ProductCard key={product._id.toString()} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Need Help Choosing?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our expert team is here to help you find the perfect pieces from our {category.name.toLowerCase()} collection. 
            Contact us for personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}