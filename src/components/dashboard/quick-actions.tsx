'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FolderPlus, PackagePlus } from 'lucide-react';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common actions to manage your inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Link href="/categories/new">
          <Button className="w-full justify-start gap-2" variant="outline">
            <FolderPlus className="h-4 w-4" />
            Add New Category
          </Button>
        </Link>
        <Link href="/products/new">
          <Button className="w-full justify-start gap-2" variant="outline">
            <PackagePlus className="h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}