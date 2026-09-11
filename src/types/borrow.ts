
export type BorrowStatus = "BORROWED" | "RETURNED";

export interface BorrowBook {
  id: number;
  isbn?: string;
  title: string;
  author: string;
  imageUrl?: string | null;
  description?: string | null;
  totalCopies?: number;
  availableCopies?: number;
}

export interface BorrowMember {
  id: number;
  fullName: string;
  email: string;
}

export interface BorrowFine {
  id: number;
  amount: number | string;
  paid: boolean;
  createdAt: string;
}

export interface BorrowRecord {
  id: number;

  member: BorrowMember;

  book: BorrowBook;

  borrowedAt: string;

  dueDate: string;

  returnedAt?: string | null;

  status: BorrowStatus;

  fines?: BorrowFine[];
}

export type BorrowDisplayStatus =
  | "Active"
  | "Due Soon"
  | "Due Today"
  | "Overdue"
  | "Returned";

