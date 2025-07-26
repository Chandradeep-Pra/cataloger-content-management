'use client';

import React from 'react';
import { Product } from '@/models/product.model';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  compact?: boolean;
}

export function ProductCard({ product, featured = false, compact = false }: ProductCardProps) {
  const cardSize = compact ? 'h-64' : featured ? 'h-96' : 'h-80';
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <CardContent className="p-0">
        <div className={`relative ${cardSize} overflow-hidden`}>
          {product.productImageid[0] ? (
            <img
              src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${product.productImageid[0]}.png`}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
            <Button size="sm" variant="outline">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Badge */}
          {!product.isActive && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Inactive
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4">
        <div className="w-full">
          <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-lg'} mb-1 line-clamp-1`}>
            {product.name}
          </h3>
          {!compact && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className={`font-bold ${compact ? 'text-sm' : 'text-lg'} text-primary`}>
              ${product.price}
            </span>
            <Badge variant="outline" className="text-xs">
              SKU: {product.sku}
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}