'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Category } from '@/types';
import Button from '../ui/Button';
import styles from './BookForm.module.css';

interface BookFormProps {
  initial?: Partial<Book>;
}

interface FormErrors {
  title?: string;
  author?: string;
  publicationDate?: string;
  publisher?: string;
  numberOfPages?: string;
  categoryId?: string;
}

export default function BookForm({ initial }: BookFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [title, setTitle] = useState(initial?.title ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [publisher, setPublisher] = useState(initial?.publisher ?? '');
  const [numberOfPages, setNumberOfPages] = useState(
    initial?.numberOfPages?.toString() ?? ''
  );
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId?.toString() ?? ''
  );
  const [publicationDate, setPublicationDate] = useState(
    initial?.publicationDate
      ? new Date(initial.publicationDate).toISOString().split('T')[0]
      : ''
  );

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.data ?? []));
  }, []);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!author.trim()) errs.author = 'Author is required';
    if (!publicationDate) errs.publicationDate = 'Publication date is required';
    if (!publisher.trim()) errs.publisher = 'Publisher is required';
    if (!numberOfPages || isNaN(Number(numberOfPages)) || Number(numberOfPages) < 1)
      errs.numberOfPages = 'Enter a valid page count';
    if (!categoryId) errs.categoryId = 'Please select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const url = isEdit ? `/api/books/${initial!.id}` : '/api/books';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          publicationDate, // Send raw YYYY-MM-DD; API stores as noon UTC to avoid day-shift
          publisher: publisher.trim(),
          numberOfPages: Number(numberOfPages),
          categoryId: Number(categoryId),
        }),
      });

      if (res.ok) {
        router.push('/books');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save book');
      }
    } catch {
      alert('Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.form__grid}>
        {/* Title — full width */}
        <div className={`${styles.form__group} ${styles['form__grid--full']}`}>
          <label htmlFor="book-title" className={styles.form__label}>
            Title <span>*</span>
          </label>
          <input
            id="book-title"
            type="text"
            className={styles.form__input}
            placeholder="e.g. The Great Gatsby"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          {errors.title && <p className={styles.form__error}>{errors.title}</p>}
        </div>

        {/* Author */}
        <div className={styles.form__group}>
          <label htmlFor="book-author" className={styles.form__label}>
            Author <span>*</span>
          </label>
          <input
            id="book-author"
            type="text"
            className={styles.form__input}
            placeholder="e.g. F. Scott Fitzgerald"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          {errors.author && <p className={styles.form__error}>{errors.author}</p>}
        </div>

        {/* Publisher */}
        <div className={styles.form__group}>
          <label htmlFor="book-publisher" className={styles.form__label}>
            Publisher <span>*</span>
          </label>
          <input
            id="book-publisher"
            type="text"
            className={styles.form__input}
            placeholder="e.g. Scribner"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          />
          {errors.publisher && (
            <p className={styles.form__error}>{errors.publisher}</p>
          )}
        </div>

        {/* Publication Date */}
        <div className={styles.form__group}>
          <label htmlFor="book-pub-date" className={styles.form__label}>
            Publication Date <span>*</span>
          </label>
          <input
            id="book-pub-date"
            type="date"
            className={styles.form__input}
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
          {errors.publicationDate && (
            <p className={styles.form__error}>{errors.publicationDate}</p>
          )}
        </div>

        {/* Number of Pages */}
        <div className={styles.form__group}>
          <label htmlFor="book-pages" className={styles.form__label}>
            Number of Pages <span>*</span>
          </label>
          <input
            id="book-pages"
            type="number"
            min="1"
            className={styles.form__input}
            placeholder="e.g. 320"
            value={numberOfPages}
            onChange={(e) => setNumberOfPages(e.target.value)}
          />
          {errors.numberOfPages && (
            <p className={styles.form__error}>{errors.numberOfPages}</p>
          )}
        </div>

        {/* Category */}
        <div className={styles.form__group}>
          <label htmlFor="book-category" className={styles.form__label}>
            Category <span>*</span>
          </label>
          <select
            id="book-category"
            className={styles.form__select}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className={styles.form__error}>{errors.categoryId}</p>
          )}
        </div>
      </div>

      <div className={styles.form__actions}>
        <Button variant="secondary" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={saving}>
          {isEdit ? '✓ Update Book' : '+ Add Book'}
        </Button>
      </div>
    </form>
  );
}
