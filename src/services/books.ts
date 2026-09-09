import api from './api';
import { Book, BookListResponse } from '@/types/book';

export interface CreateBookInput {
  isbn: string; title: string; author: string; description: string;
  totalCopies: number; categoryIds: number[];
}

export const getBooks = async (params?: { search?: string; page?: number; limit?: number }): Promise<BookListResponse> => {
  const response = await api.get<BookListResponse>('/books', { params });
  return response.data;
};
export const createBook = async (input: CreateBookInput): Promise<Book> => (await api.post<Book>('/books', input)).data;
export const deleteBook = async (id: number): Promise<void> => { await api.delete(`/books/${id}`); };
