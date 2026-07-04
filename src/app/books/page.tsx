'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Plus, Library, Tag, LayoutGrid } from 'lucide-react';
import { Book } from '@/types';
import Button from '@/components/ui/Button';
import BookCard from '@/components/books/BookCard';
import BookFilters from '@/components/books/BookFilters';
import EmptyState from '@/components/ui/EmptyState';
import styles from './BooksPage.module.css';

const COVER_PALETTES = [
  'linear-gradient(160deg, #1a1040 0%, #3b1fa8 60%, #6d28d9 100%)',
  'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(160deg, #200122 0%, #6f0000 100%)',
  'linear-gradient(160deg, #0d1b2a 0%, #1b4332 60%, #2d6a4f 100%)',
  'linear-gradient(160deg, #1a0533 0%, #4a044e 60%, #7b2d8b 100%)',
  'linear-gradient(160deg, #2d1b00 0%, #7a3b00 60%, #b45309 100%)',
  'linear-gradient(160deg, #030712 0%, #1e3a5f 60%, #1d4ed8 100%)',
  'linear-gradient(160deg, #1a1a1a 0%, #2d3748 50%, #4a5568 100%)',
];

function getCoverStyle(id: number) {
  return COVER_PALETTES[id % COVER_PALETTES.length];
}

function BooksContent() {
  const searchParams = useSearchParams();

  // All books (unfiltered) — for hero section & stats. Always static.
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);

  // Filtered books — for the grid section
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [gridLoading, setGridLoading] = useState(true);

  const isFiltered = !!(
    searchParams.get('search') ||
    searchParams.get('categoryId') ||
    searchParams.get('from') ||
    searchParams.get('to')
  );

  // Fetch all books + categories once on mount (for hero/stats — no filter)
  useEffect(() => {
    Promise.all([
      fetch('/api/books').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ]).then(([booksData, catData]) => {
      setAllBooks(booksData.data ?? []);
      setTotalCategories(catData.data?.length ?? 0);
    }).catch(() => { });
  }, []);

  // Fetch filtered books whenever search params change
  const fetchFiltered = useCallback(async () => {
    setGridLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const res = await fetch(`/api/books?${params.toString()}`);
      const data = await res.json();
      setFilteredBooks(data.data ?? []);
    } catch {
      setFilteredBooks([]);
    } finally {
      setGridLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFiltered();
  }, [fetchFiltered]);

  const featured = allBooks[0];

  return (
    <>
      {/* ── Hero Section: ALWAYS visible, never changes on filter ── */}
      {featured && (
        <div className={styles.hero}>
          {/* Featured Book */}
          <div className={styles.featured}>
            <div
              className={styles.featured_bg}
              style={{ background: getCoverStyle(featured.id) }}
            />
            <div className={styles.featured_overlay} />
            <div className={styles.featured_body}>
              <div
                className={styles.featured_cover}
                style={{ background: getCoverStyle(featured.id) }}
              >
                <p className={styles.featured_cover_author}>{featured.author}</p>
                <p className={styles.featured_cover_title}>{featured.title}</p>
              </div>
              <div className={styles.featured_text}>
                <span className={styles.featured_label}>Latest Added</span>
                <h2 className={styles.featured_title}>{featured.title}</h2>
                <p className={styles.featured_author}>by {featured.author}</p>
                <div className={styles.featured_meta}>
                  {featured.category && (
                    <span className={styles.featured_badge}>{featured.category.name}</span>
                  )}
                  <span className={styles.featured_pages}>
                    {featured.numberOfPages.toLocaleString()} pages
                  </span>
                </div>
                <div className={styles.featured_dots}>
                  <span className={`${styles.featured_dot} ${styles.active}`} />
                  <span className={styles.featured_dot} />
                  <span className={styles.featured_dot} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className={styles.stats_panel}>
            <h2 className={styles.stats_heading}>My Library</h2>
            <a href="/books" className={styles.stat_card}>
              <div className={styles.stat_card_text}>
                <span className={styles.stat_card_title}>Total Books</span>
                <span className={styles.stat_card_sub}>
                  {allBooks.length} book{allBooks.length !== 1 ? 's' : ''} in your collection
                </span>
              </div>
              <div
                className={styles.stat_card_thumb}
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
              >
                <BookOpen size={20} color="#a78bfa" />
              </div>
            </a>
            <a href="/categories" className={styles.stat_card}>
              <div className={styles.stat_card_text}>
                <span className={styles.stat_card_title}>Categories</span>
                <span className={styles.stat_card_sub}>
                  {totalCategories} categor{totalCategories !== 1 ? 'ies' : 'y'} organized
                </span>
              </div>
              <div
                className={styles.stat_card_thumb}
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <Tag size={20} color="#34d399" />
              </div>
            </a>
            <a href="/books/new" className={styles.stat_card}>
              <div className={styles.stat_card_text}>
                <span className={styles.stat_card_title}>Manage Collection</span>
                <span className={styles.stat_card_sub}>Add, edit, filter and organize</span>
              </div>
              <div
                className={styles.stat_card_thumb}
                style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}
              >
                <LayoutGrid size={20} color="#fbbf24" />
              </div>
            </a>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <BookFilters />

      {/* ── Book Grid ── */}
      {gridLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <span className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={40} strokeWidth={1.5} color="var(--color-text-muted)" />}
          title="No books found"
          description="Try adjusting your filters or add your first book to get started."
          action={
            <Button href="/books/new">
              <Plus size={16} />
              Add Book
            </Button>
          }
        />
      ) : (
        <div>
          <div className={styles.section_header}>
            <h2 className={styles.section_title}>
              {isFiltered ? 'Search Results' : 'All Books'}
            </h2>
            <span className={styles.section_count}>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
            </span>
          </div>
          <div className={styles.book_grid} style={{ marginTop: '1rem' }}>
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onDeleted={fetchFiltered} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function BooksPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.header_title}>
          <Library size={26} strokeWidth={2} color="var(--color-accent-hover)" />
          Books
        </h1>
        <Button href="/books/new">
          <Plus size={16} />
          Add Book
        </Button>
      </div>

      <Suspense
        fallback={
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
            <span className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        }
      >
        <BooksContent />
      </Suspense>
    </div>
  );
}
