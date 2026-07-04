'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Category } from '@/types';
import styles from './BookFilters.module.css';

export default function BookFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') ?? '');
  const [from, setFrom] = useState(searchParams.get('from') ?? '');
  const [to, setTo] = useState(searchParams.get('to') ?? '');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.data ?? []));
  }, []);

  const applyFilters = useCallback(
    (s: string, cat: string, f: string, t: string) => {
      const params = new URLSearchParams();
      if (s) params.set('search', s);
      if (cat) params.set('categoryId', cat);
      if (f) params.set('from', f);
      if (t) params.set('to', t);
      router.push(`/books?${params.toString()}`);
    },
    [router]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters(search, categoryId, from, to);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, categoryId, from, to, applyFilters]);

  const activeCount = [search, categoryId, from, to].filter(Boolean).length;

  const clearAll = () => {
    setSearch('');
    setCategoryId('');
    setFrom('');
    setTo('');
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filters__row}>
        {/* Search */}
        <div className={styles.filters__group}>
          <label className={styles.filters__label}>Search</label>
          <div className={styles.filters__search_wrapper}>
            <span className={styles.filters__search_icon}><Search size={14} /></span>
            <input
              id="book-search"
              type="text"
              className={styles.filters__input}
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search title, author, publisher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div className={styles.filters__group}>
          <label className={styles.filters__label}>Category</label>
          <select
            id="book-filter-category"
            className={styles.filters__select}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div className={styles.filters__group}>
          <label className={styles.filters__label}>Published From</label>
          <input
            id="book-filter-from"
            type="date"
            className={styles.filters__input}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* To Date */}
        <div className={styles.filters__group}>
          <label className={styles.filters__label}>Published To</label>
          <input
            id="book-filter-to"
            type="date"
            className={styles.filters__input}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      {activeCount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button className={styles.filters__clear} onClick={clearAll}>
            <span className={styles.filters__active_count}>{activeCount}</span>
            Clear filters
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
