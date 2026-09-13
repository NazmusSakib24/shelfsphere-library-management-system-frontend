
export interface FineBorrowRecord {
  id: number;

  borrowedAt?: string;

  dueDate?: string;

  returnedAt?: string | null;

  status?: "BORROWED" | "RETURNED";

  member?: FineMember;

  book?: FineBook;
}

export interface FineMember {
  id: number;

  fullName: string;

  email: string;
}

export interface FineBook {
  id: number;
  title: string;
  author?: string;
  imageUrl?: string | null;
}

export interface Fine {
  id: number;

  amount: number | string;

  paid: boolean;

  createdAt: string;

  borrowRecord: FineBorrowRecord;
}
