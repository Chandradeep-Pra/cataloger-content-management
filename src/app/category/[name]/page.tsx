'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, X } from 'lucide-react';

type Category = {
  _id: string;
  name: string;
  description?: string;
  level: number;
  isPublic: boolean;
  productCount: number;
  categoryImageIds: string[];
  createdAt: string;
  updatedAt: string;
};

export default function CategoryPage({ params }: { params: { name: string } }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
  const router = useRouter();

  const loadCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/category/${id}`);
      if (!res.ok) throw new Error('Failed to fetch category');
      const data = await res.json();
      if (!data?.category) throw new Error('Not found');
      setCategory(data.category);
    } catch (err) {
      console.error('Category load error:', err);
      router.push('/not-found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory(params.name);
  }, [params.name]);

  const handleImageClick = (index: number) => {
    setExpandedImageIndex((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          {[1, 2].map((_, i) => (
            <Skeleton key={i} className="h-48 w-48 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-80" />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header + Controls */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground text-base max-w-xl">
            {category.description || 'No description available for this category.'}
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge>{category.isPublic ? 'Public' : 'Private'}</Badge>
            <Badge variant="outline">Level {category.level}</Badge>
            <Badge variant="secondary">{category.productCount} Products</Badge>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            className="rounded-xl hover:bg-primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button className="rounded-full p-2 hover:scale-110 transition">
            <Plus />
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {category.categoryImageIds?.length > 0 ? (
            category.categoryImageIds.map((id, index) => {
              const isExpanded = expandedImageIndex === index;
              return (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`relative border overflow-hidden rounded-md group cursor-pointer transition-all ${
                    isExpanded ? 'col-span-2 md:col-span-3 h-[500px]' : 'h-48'
                  }`}
                >
                  <Image
                    src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${id}.png`}
                    alt={`Category Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedImageIndex(null);
                      }}
                      className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full hover:bg-white text-black shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground">No images added to this category.</p>
          )}
        </div>
      </div>

      {/* Products Placeholder */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Products in this Category</h2>
        <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
          Product list coming soon.
        </div>
      </div>

      {/* Metadata / Timestamp */}
      <div className="text-sm text-muted-foreground mt-8">
        <p>Created at: {new Date(category.createdAt).toLocaleDateString()}</p>
        <p>Last updated: {new Date(category.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
