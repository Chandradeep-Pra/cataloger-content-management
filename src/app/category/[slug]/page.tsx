import { notFound } from 'next/navigation';
import { GridView } from '@/components/catalog/views/GridView';
import { BannerGridView } from '@/components/catalog/views/BannerGridView';
import { LookbookView } from '@/components/catalog/views/LookbookView';
import { StoryView } from '@/components/catalog/views/StoryView';
import { CarouselGridView } from '@/components/catalog/views/CarouselGridView';
import { SubcategoryView } from '@/components/catalog/views/SubcategoryView';
import { RichTextView } from '@/components/catalog/views/RichTextView';
import { Category, CategoryViewType } from '@/models/category.model';
import { Product } from '@/models/product.model';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function getCategoryData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories/${slug}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

function renderCategoryView(viewType: CategoryViewType, category: Category, products: Product[]) {
  const props = { category, products };
  
  switch (viewType) {
    case 'grid':
      return <GridView {...props} />;
    case 'banner-grid':
      return <BannerGridView {...props} />;
    case 'lookbook':
      return <LookbookView {...props} />;
    case 'story':
      return <StoryView {...props} />;
    case 'carousel-grid':
      return <CarouselGridView {...props} />;
    case 'subcategory':
      return <SubcategoryView {...props} />;
    case 'rich-text':
      return <RichTextView {...props} />;
    default:
      return <GridView {...props} />;
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const data = await getCategoryData(params.slug);
  
  if (!data || !data.success) {
    notFound();
  }

  const { category, products } = data;
  
  return (
    <div className="min-h-screen bg-background">
      {renderCategoryView(category.layout.viewType, category, products)}
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const data = await getCategoryData(params.slug);
  
  if (!data || !data.success) {
    return {
      title: 'Category Not Found',
    };
  }

  const { category } = data;
  
  return {
    title: category.name,
    description: category.description,
  };
}