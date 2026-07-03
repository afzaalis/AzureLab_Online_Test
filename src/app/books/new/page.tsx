import type { Metadata } from 'next';
import BookForm from '@/components/books/BookForm';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Add New Book',
};

export default function NewBookPage() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Book</h1>
          <p className="page-subtitle">Fill in the details to add a book to your collection</p>
        </div>
        <Button variant="secondary" href="/books">
          ← Back to Books
        </Button>
      </div>
      <BookForm />
    </div>
  );
}
