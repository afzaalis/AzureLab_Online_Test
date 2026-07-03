'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import Button from '../ui/Button';
import styles from './CategoryForm.module.css';

interface CategoryFormProps {
  initial?: Partial<Category>;
}

export default function CategoryForm({ initial }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errs: { name?: string } = {};
    if (!name.trim()) errs.name = 'Category name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const url = isEdit ? `/api/categories/${initial!.id}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });

      if (res.ok) {
        router.push('/categories');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save category');
      }
    } catch {
      alert('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.form__group}>
        <label htmlFor="category-name" className={styles.form__label}>
          Category Name <span>*</span>
        </label>
        <input
          id="category-name"
          type="text"
          className={styles.form__input}
          placeholder="e.g. Science Fiction"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        {errors.name && <p className={styles.form__error}>{errors.name}</p>}
      </div>

      <div className={styles.form__group}>
        <label htmlFor="category-description" className={styles.form__label}>
          Description
        </label>
        <textarea
          id="category-description"
          className={styles.form__textarea}
          placeholder="Optional description of this category..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.form__actions}>
        <Button variant="secondary" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={saving}>
          {isEdit ? '✓ Update Category' : '+ Create Category'}
        </Button>
      </div>
    </form>
  );
}
