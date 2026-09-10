import api from './api';
import { Book, BookListResponse } from '@/types/book';

export interface CreateBookInput {
  isbn: string;
  title: string;
  author: string;
  description: string;
  totalCopies: number;
  categoryIds: number[];
}

export interface UpdateBookInput {
  isbn?: string;
  title?: string;
  author?: string;
  description?: string;
  totalCopies?: number;
  categoryIds?: number[];
}

export const getBooks = async (
  params?: {
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<BookListResponse> => {
  const response = await api.get<BookListResponse>(
    '/books',
    { params }
  );

  return response.data;
};

export const createBook = async (
  input: CreateBookInput
): Promise<Book> => {
  const response = await api.post<Book>(
    '/books',
    input
  );

  return response.data;
};

export const updateBook = async (
  id: number,
  input: UpdateBookInput
): Promise<Book> => {
  const response = await api.patch<Book>(
    `/books/${id}`,
    input
  );

  return response.data;
};

export const deleteBook = async (
  id: number
): Promise<void> => {
  await api.delete(`/books/${id}`);
};

export const uploadBookImage = async (
  id: number,
  file: File
): Promise<Book> => {
  const formData = new FormData();

  formData.append('image', file);

  const response = await api.post<Book>(
    `/books/${id}/image`,
    formData
  );

  return response.data;
};