'use client';

import { useState } from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import { Book } from '@/types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import styles from './BookCard.module.css';

// Palette of premium gradients for book covers
const COVER_PALETTES = [
  'linear-gradient(160deg, #1a1040 0%, #3b1fa8 60%, #6d28d9 100%)',
  'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(160deg, #200122 0%, #6f0000 100%)',
  'linear-gradient(160deg, #0d1b2a 0%, #1b4332 60%, #2d6a4f 100%)',
  'linear-gradient(160deg, #1a0533 0%, #4a044e 60%, #7b2d8b 100%)',
  'linear-gradient(160deg, #2d1b00 0%, #7a3b00 60%, #b45309 100%)',
  'linear-gradient(160deg, #030712 0%, #1e3a5f 60%, #1d4ed8 100%)',
  'linear-gradient(160deg, #1a1a1a 0%, #2d3748 50%, #4a5568 100%)',
  'linear-gradient(160deg, #0a0f1e 0%, #1e2d4f 50%, #0e4d6e 100%)',
  'linear-gradient(160deg, #14001a 0%, #2d1b69 60%, #4c1d95 100%)',
];

function getCoverStyle(id: number) {
  return COVER_PALETTES[id % COVER_PALETTES.length];
}

interface BookCardProps {
  book: Book;
  onDeleted: () => void;
}

export default function BookCard({ book, onDeleted }: BookCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowModal(false);
        onDeleted();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete book');
      }
    } catch {
      alert('Failed to delete book');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cover_container}>
          {/* Simulated book cover */}
          <div
            className={styles.cover}
            style={{ background: getCoverStyle(book.id) }}
          >
            <div className={styles.cover_content}>
              <p className={styles.cover_author}>{book.author}</p>
              <h3 className={styles.cover_title}>{book.title}</h3>
            </div>
            <BookOpen size={24} color="rgba(255,255,255,0.2)" />
          </div>

          {/* Hover overlay with actions */}
          <div className={styles.overlay}>
            <Button
              variant="ghost"
              size="icon"
              href={`/books/${book.id}/edit`}
              title="Edit book"
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowModal(true)}
              title="Delete book"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {/* Below cover: title + category */}
        <div className={styles.info}>
          <p className={styles.title} title={book.title}>{book.title}</p>
          <p className={styles.category}>
            {book.category?.name ?? 'Uncategorized'}
          </p>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        title="Delete Book"
        message={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
