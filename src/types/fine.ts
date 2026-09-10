
export interface FineBorrowRecord {
  id: number;

  borrowedAt?: string;

  dueDate?: string;

  returnedAt?: string | null;

  status?: "BORROWED" | "RETURNED";

  member?: FineMember;
}

export interface FineMember {
  id: number;

  fullName: string;

  email: string;
}

export interface Fine {
  id: number;

  amount: number | string;

  paid: boolean;

  createdAt: string;

  borrowRecord: FineBorrowRecord;
}
