'use client';

import React from 'react';
import { Category } from '@/models/category.model';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Package, FolderTree } from 'lucide-react';
import Image from 'next/image';

interface CategoryCardProps {
  key: string;
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
   onClick?: () => void; 
}



export function CategoryCard({ key,category, onEdit, onDelete, onClick }: CategoryCardProps) {
  // console.log('CategoryCard rendered with category:', category);
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" onClick={onClick} key={key}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={category.isPublic ? 'default' : 'secondary'}>
                {category.isPublic ? 'Public' : 'Private'}
              </Badge>
              <Badge variant="outline">Level {category.level}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {category.categoryImageIds && (
          <div className="aspect-video rounded-md overflow-hidden object-cover">
            <img
              src={`https://res.cloudinary.com/dd2w4lpft/image/upload/${category.categoryImageIds[1]}.png`}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{category.productCount} products</span>
          </div>
          {category.parent && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <FolderTree className="h-4 w-4" />
              <span>Parent: {category.parent.name}</span>
            </div>
          )}
        </div>
        
        {category.children && category.children.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Children:</span>{' '}
            {category.children.map(child => child.name).join(', ')}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={(e) => {
          e.stopPropagation(); 
          onEdit(category)}}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm"  onClick={(e) => e.stopPropagation()}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent  onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{category.name}"? This action cannot be undone and will also delete all subcategories and products.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel  onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={(e) => {
          e.stopPropagation();
          onDelete(String(category._id));
        }}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}