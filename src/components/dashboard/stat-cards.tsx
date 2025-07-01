'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/index ';
import { FolderTree, Package, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      icon: FolderTree,
      description: `${stats.publicCategories} public, ${stats.privateCategories} private`
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      description: `${stats.activeProducts} active, ${stats.inactiveProducts} inactive`
    },
    {
      title: 'Public Categories',
      value: stats.publicCategories,
      icon: Eye,
      description: 'Visible to customers'
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      icon: CheckCircle,
      description: 'Available for sale'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}