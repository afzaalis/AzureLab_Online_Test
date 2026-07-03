import type { Metadata } from 'next';
import CategoryForm from '@/components/categories/CategoryForm';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Add Category',
};

export default function NewCategoryPage() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Category</h1>
          <p className="page-subtitle">Create a new category to group your books</p>
        </div>
        <Button variant="secondary" href="/categories">
          ← Back to Categories
        </Button>
      </div>
      <CategoryForm />
    </div>
  );
}
