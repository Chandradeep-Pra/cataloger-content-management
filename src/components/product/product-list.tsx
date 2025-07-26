'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/models/product.model';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type ProductListProps = {
  categoryId: string;
  searchTerm: string;
  statusFilter: string;
  priceFilter: string;
};

 const ProductList = ({
  categoryId,
  searchTerm,
  statusFilter,
  priceFilter,
}: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?categoryId=${categoryId}`);
        const data = await res.json();
        setProducts(data.products || []);
        console.log(data.products);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'in_stock' && product.stock > 0) ||
      (statusFilter === 'out_of_stock' && product.stock === 0);

    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'under_50' && product.price < 50) ||
      (priceFilter === '50_100' && product.price >= 50 && product.price <= 100) ||
      (priceFilter === 'over_100' && product.price > 100);

    return matchesSearch && matchesStatus && matchesPrice;
  });

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!filtered.length) {
    return <div className="text-muted-foreground text-center py-8">No products found.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((product) => (
        <div
          key={product._id}
          className="border rounded-xl p-4 hover:shadow-md transition bg-white space-y-2"
        >
          {product.images?.[0] && (
            <div className="relative h-48 w-full overflow-hidden rounded-md">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-muted-foreground text-sm">{product.description}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Badge variant="secondary">${product.price}</Badge>
              <Badge variant={product.stock > 0 ? 'default' : 'outline'}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList
