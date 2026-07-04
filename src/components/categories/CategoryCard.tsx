'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Tag } from 'lucide-react';
import { Category } from '@/types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
  onDeleted: () => void;
}

export default function CategoryCard({ category, onDeleted }: CategoryCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const bookCount = category._count?.books ?? 0;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setShowModal(false);
        onDeleted();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete category');
      }
    } catch {
      alert('Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.card__header}>
          <div className={styles.card__icon}>
            <Tag size={22} strokeWidth={1.8} />
          </div>
          <h3 className={styles.card__name}>{category.name}</h3>
          <div className={styles.card__actions}>
            <Button
              variant="ghost"
              size="icon"
              href={`/categories/${category.id}/edit`}
              title="Edit category"
            >
              <Pencil size={15} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowModal(true)}
              title="Delete category"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        </div>

        {category.description && (
          <p className={styles.card__description}>{category.description}</p>
        )}

        <div className={styles.card__footer}>
          <span className={styles.card__meta}>
            {new Date(category.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <Badge variant={bookCount > 0 ? 'accent' : 'muted'}>
            {bookCount} {bookCount === 1 ? 'book' : 'books'}
          </Badge>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        title="Delete Category"
        message={
          bookCount > 0
            ? `Cannot delete "${category.name}" because it has ${bookCount} book(s). Please reassign or delete the books first.`
            : `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
        }
        confirmLabel={bookCount > 0 ? 'OK' : 'Delete'}
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={bookCount > 0 ? () => setShowModal(false) : handleDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
