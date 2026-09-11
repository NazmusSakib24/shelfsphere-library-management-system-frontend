
import api from "@/services/api";
import { BorrowRecord } from "@/types/borrow";

export interface CreateBorrowInput {
  memberId: number;
  bookId: number;
}

export const getBorrows = async (): Promise<
  BorrowRecord[]
> => {
  const response = await api.get<BorrowRecord[]>(
    "/borrows",
  );

  return response.data;
};

export const createBorrow = async (
  input: CreateBorrowInput,
): Promise<BorrowRecord> => {
  const response = await api.post<BorrowRecord>(
    "/borrows",
    input,
  );

  return response.data;
};

export const returnBook = async (
  borrowId: number,
) => {
  const response = await api.patch(
    `/borrows/${borrowId}/return`,
  );

  return response.data;
};
