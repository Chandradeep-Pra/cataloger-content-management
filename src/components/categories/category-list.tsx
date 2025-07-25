// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Category } from '@/models/category.model';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Search, Filter, Plus } from 'lucide-react';
// import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';
// import { CategoryCard } from './category-card';
// import { CategoryFormDialog } from './category-form-dialog';

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Category } from '@/models/category.model';
import { SearchAndFilter } from '../SearchAndFilter';
import { CategoryCard } from './category-card';
import { CategoryFormDialog } from './category-form-dialog';

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('api/category');
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (category: Category) => {
    router.push(`/dashboard/category/${category._id}`);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/category', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      toast.success('Category deleted successfully');
      if (!json.success) throw new Error(json.message);
      await loadCategories();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingCategory(null);
    loadCategories();
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'public' && category.isPublic) ||
      (statusFilter === 'private' && !category.isPublic);

    const matchesLevel = levelFilter === 'all' || category.level?.toString() === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories and hierarchy</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <SearchAndFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search categories..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Public', value: 'public' },
              { label: 'Private', value: 'private' },
            ],
          },
          {
            key: 'level',
            label: 'Level',
            value: levelFilter,
            onChange: setLevelFilter,
            options: [
              { label: 'All Levels', value: 'all' },
              { label: 'Level 1', value: '1' },
              { label: 'Level 2', value: '2' },
              { label: 'Level 3', value: '3' },
            ],
          },
        ]}
      />

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Showing {filteredCategories.length} of {categories.length} categories
        </span>
        {(statusFilter !== 'all' || levelFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter('all');
              setLevelFilter('all');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={() => handleCardClick(category)}
            />
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        category={editingCategory}
        onSuccess={handleDialogClose}
        categories={categories}
      />
    </div>
  );
}


// type SearchAndFilterProps = {
//   searchTerm: string;
//   setSearchTerm: (val: string) => void;
//   statusFilter: string;
//   setStatusFilter: (val: string) => void;
//   levelFilter: string;
//   setLevelFilter: (val: string) => void;
// };

// function SearchAndFilter({
//   searchTerm,
//   setSearchTerm,
//   statusFilter,
//   setStatusFilter,
//   levelFilter,
//   setLevelFilter,
// }: SearchAndFilterProps) {
//   return (
//     <div className="flex flex-col gap-4 md:flex-row md:items-center">
//       <div className="relative flex-1">
//         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search categories..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-10"
//         />
//       </div>
//       <div className="flex gap-2">
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[120px]">
//             <SelectValue placeholder="Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="public">Public</SelectItem>
//             <SelectItem value="private">Private</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select value={levelFilter} onValueChange={setLevelFilter}>
//           <SelectTrigger className="w-[120px]">
//             <SelectValue placeholder="Level" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Levels</SelectItem>
//             <SelectItem value="1">Level 1</SelectItem>
//             <SelectItem value="2">Level 2</SelectItem>
//             <SelectItem value="3">Level 3</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   );
// }
