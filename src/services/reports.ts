import api from "@/services/api";



export interface MostBorrowedBook {
  title: string;
  borrowCount: number;
}

export interface TopMember {
  member: string;
  borrowCount: number;
}

export interface OverdueBook {
  id: number;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: string;

  book?: {
    id: number;
    title: string;
  };

  member?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface FinesReport {
  totalFines: number;
  paidFines: number;
  unpaidFines: number;
}


export async function getMostBorrowedBooks(): Promise<
  MostBorrowedBook[]
> {
  const response = await api.get("/reports/most-borrowed");

  return response.data;
}

/**
 * Get currently overdue books.
 *
 * Backend:
 * GET /reports/overdue-books
 */
export async function getOverdueBooks(): Promise<OverdueBook[]> {
  const response = await api.get("/reports/overdue-books");

  return response.data;
}

/**
 * Get members with the highest number of borrow records.
 *
 * Backend:
 * GET /reports/top-members
 */
export async function getTopMembers(): Promise<TopMember[]> {
  const response = await api.get("/reports/top-members");

  return response.data;
}

/**
 * Get financial/fine report.
 *
 * Backend:
 * GET /reports/fines
 */
export async function getFinesReport(): Promise<FinesReport> {
  const response = await api.get("/reports/fines");

  return response.data;
}