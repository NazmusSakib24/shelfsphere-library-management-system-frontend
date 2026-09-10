import api from "./api";
import { BorrowRecord } from "@/types/borrow";

export const getBorrows = async (): Promise<BorrowRecord[]> => {
  const response = await api.get<BorrowRecord[]>("/borrows");

  return response.data;
};

export const returnBook = async (
  borrowId: number,
): Promise<BorrowRecord> => {
  const response = await api.patch<BorrowRecord>(
    `/borrows/${borrowId}/return`,
  );

  return response.data;
};