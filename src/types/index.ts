export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    books: number;
  };
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publicationDate: string;
  publisher: string;
  numberOfPages: number;
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface BookFilters {
  search?: string;
  categoryId?: string;
  from?: string;
  to?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
