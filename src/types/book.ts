export interface BookCategory { id: number; name: string; }
export interface Book {
  id: number; isbn: string; title: string; author: string;
  description?: string | null; totalCopies: number; availableCopies: number;
  categories?: BookCategory[];
}
export interface BookListResponse { total: number; page: number; limit: number; data: Book[]; }
