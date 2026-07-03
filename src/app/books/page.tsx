'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Book } from '@/types';
import Button from '@/components/ui/Button';
import BookCard from '@/components/books/BookCard';
import BookFilters from '@/components/books/BookFilters';
import EmptyState from '@/components/ui/EmptyState';
import { Suspense } from 'react';

function BookListContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const res = await fetch(`/api/books?${params.toString()}`);
      const data = await res.json();
      setBooks(data.data ?? []);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <>
      <BookFilters />

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4rem',
          }}
        >
          <span className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No books found"
          description="Try adjusting your filters or add your first book to get started."
          action={<Button href="/books/new">+ Add Book</Button>}
        />
      ) : (
        <>
          <div
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
            }}
          >
            {books.length} {books.length === 1 ? 'book' : 'books'} found
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} onDeleted={fetchBooks} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function BooksPage() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 Books</h1>
          <p className="page-subtitle">Browse and manage your book collection</p>
        </div>
        <Button href="/books/new">+ Add Book</Button>
      </div>

      <Suspense fallback={<div className="spinner" />}>
        <BookListContent />
      </Suspense>
    </div>
  );
}
