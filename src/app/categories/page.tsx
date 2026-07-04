'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tag, Plus } from 'lucide-react';
import { Category } from '@/types';
import Button from '@/components/ui/Button';
import CategoryCard from '@/components/categories/CategoryCard';
import EmptyState from '@/components/ui/EmptyState';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.data ?? []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Tag size={30} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Categories
          </h1>
          <p className="page-subtitle">Organize books into categories</p>
        </div>
        <Button href="/categories/new">
          <Plus size={16} />
          Add Category
        </Button>
      </div>

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
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first category to start organizing your books."
          action={
            <Button href="/categories/new">
              <Plus size={16} />
              Add Category
            </Button>
          }
        />
      ) : (
        <>
          <div
            style={{
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
            }}
          >
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </div>
          <div className="grid-cards">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onDeleted={fetchCategories}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
