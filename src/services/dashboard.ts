import api from "./api";

export interface DashboardActivity {
  week: string;
  borrows: number;
  returned: number;
}

export interface DashboardCategory {
  name: string;
  count: number;
  percentage: number;
}

export interface RecentActivity {
  id: number;
  memberName: string;
  bookTitle: string;
  borrowedAt: string;
  returnedAt?: string | null;
  dueDate?: string;
  status: "BORROWED" | "RETURNED";
}

export interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  borrowedBooks: number;
  availableBooks: number;
  totalBorrows: number;
  unpaidFines: number;
  activity: DashboardActivity[];
  categories: DashboardCategory[];
  recentActivity: RecentActivity[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>(
    "/dashboard/stats"
  );

  return response.data;
};
