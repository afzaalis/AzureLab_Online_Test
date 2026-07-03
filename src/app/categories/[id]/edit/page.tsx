import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/categories/CategoryForm';
import Button from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  return { title: category ? `Edit: ${category.name}` : 'Edit Category' };
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { books: true } } },
  });

  if (!category) notFound();

  const serialized = {
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Category</h1>
          <p className="page-subtitle">{category.name}</p>
        </div>
        <Button variant="secondary" href="/categories">
          ← Back to Categories
        </Button>
      </div>
      <CategoryForm initial={serialized} />
    </div>
  );
}
