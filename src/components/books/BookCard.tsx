'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import styles from './BookCard.module.css';

interface BookCardProps {
  book: Book;
  onDeleted: () => void;
}

export default function BookCard({ book, onDeleted }: BookCardProps) {
  const router = useRouter();
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

  const pubDate = new Date(book.publicationDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <div className={styles.card}>
        <div className={styles.card__body}>
          <h3 className={styles.card__title} title={book.title}>
            {book.title}
          </h3>
          <p className={styles.card__author}>by {book.author}</p>
          <div className={styles.card__meta}>
            <span className={styles.card__meta_item}>
              <span className={styles.card__meta_icon}>📅</span>
              {pubDate}
            </span>
            <span className={styles.card__meta_item}>
              <span className={styles.card__meta_icon}>🏢</span>
              {book.publisher}
            </span>
            <span className={styles.card__meta_item}>
              <span className={styles.card__meta_icon}>📄</span>
              {book.numberOfPages.toLocaleString()} pages
            </span>
            {book.category && (
              <Badge variant="accent">{book.category.name}</Badge>
            )}
          </div>
        </div>

        <div className={styles.card__actions}>
          <Button
            variant="ghost"
            size="icon"
            href={`/books/${book.id}/edit`}
            title="Edit book"
          >
            ✏️
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowModal(true)}
            title="Delete book"
          >
            🗑️
          </Button>
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
