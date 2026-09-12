import api from "./api";

export interface MemberCategory {
  id?: number;
  name: string;
}

export interface MemberBook {
  id: number;
  title: string;
  author?: string;
  imageUrl?: string | null;
  categories?: MemberCategory[];
}

export interface MemberBorrow {
  id: number;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string | null;
  status: "BORROWED" | "RETURNED";
  book: MemberBook;
}

export interface MemberReservation {
  id: number;
  reservedAt: string;
  book: MemberBook;
}

export interface MemberFine {
  id: number;
  amount: number | string;
  paid: boolean;
  createdAt: string;
}

export interface MemberActivity {
  id: number;
  bookTitle: string;
  borrowedAt: string;
  returnedAt?: string | null;
  dueDate?: string;
  status: "BORROWED" | "RETURNED";
}

export interface MemberDashboard {
  borrowedBooks: number;
  reservedBooks: number;
  pendingFines: number;
  totalFineAmount: number;
  booksRead: number;

  currentBorrows: MemberBorrow[];
  reservations: MemberReservation[];
  recentActivity: MemberActivity[];
  fines: MemberFine[];
}

export const getMemberDashboard =
  async (): Promise<MemberDashboard> => {
    const response =
      await api.get<MemberDashboard>(
        "/dashboard/member",
      );

    const data = response.data;

    return {
      ...data,
      currentBorrows: Array.isArray(data.currentBorrows)
        ? data.currentBorrows
        : [],
      reservations: Array.isArray(data.reservations)
        ? data.reservations
        : [],
      recentActivity: Array.isArray(data.recentActivity)
        ? data.recentActivity
        : [],
      fines: Array.isArray(data.fines)
        ? data.fines
        : [],
    };
  };
