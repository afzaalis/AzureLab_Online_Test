import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BookForm from '@/components/books/BookForm';
import Button from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });
  return { title: book ? `Edit: ${book.title}` : 'Edit Book' };
}

export default async function EditBookPage({ params }: PageProps) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

  if (!book) notFound();

  const serialized = {
    ...book,
    publicationDate: book.publicationDate.toISOString(),
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
    category: book.category
      ? {
          ...book.category,
          createdAt: book.category.createdAt.toISOString(),
          updatedAt: book.category.updatedAt.toISOString(),
        }
      : undefined,
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Book</h1>
          <p className="page-subtitle">{book.title}</p>
        </div>
        <Button variant="secondary" href="/books">
          ← Back to Books
        </Button>
      </div>
      <BookForm initial={serialized} />
    </div>
  );
}
