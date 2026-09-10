"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Plus,
  Search,
} from "lucide-react";

import BorrowStats from "@/components/borrows/BorrowStats";
import BorrowTabs from "@/components/borrows/BorrowTabs";
import BorrowTable from "@/components/borrows/BorrowTable";
import BorrowDetailsModal from "@/components/borrows/BorrowDetailsModal";
import BorrowPagination from "@/components/borrows/BorrowPagination";

import {
  getBorrows,
  returnBook,
} from "@/services/borrows";

import {
  BorrowRecord,
  BorrowDisplayStatus,
} from "@/types/borrow";

function getDisplayStatus(
  borrow: BorrowRecord,
): BorrowDisplayStatus {
  if (borrow.status === "RETURNED") {
    return "Returned";
  }

  const today = new Date();
  const dueDate = new Date(borrow.dueDate);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return "Overdue";
  }

  if (dueDate.getTime() === today.getTime()) {
    return "Due Today";
  }

  const difference =
    dueDate.getTime() - today.getTime();

  const days =
    difference / (1000 * 60 * 60 * 24);

  if (days <= 3) {
    return "Due Soon";
  }

  return "Active";
}

export default function BorrowsPage() {
  const [borrows, setBorrows] = useState<
    BorrowRecord[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] =
    useState("all");

  const [selectedBorrow, setSelectedBorrow] =
    useState<BorrowRecord | null>(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;

  // =========================
  // LOAD BORROWS
  // =========================

  const loadBorrows = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBorrows();

      setBorrows(data);
    } catch (err) {
      console.error(
        "Failed to load borrows:",
        err,
      );

      setError(
        "Failed to load borrow records.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATS
  // =========================

  const activeLoans = useMemo(() => {
    return borrows.filter(
      (borrow) =>
        borrow.status === "BORROWED",
    ).length;
  }, [borrows]);

  const dueToday = useMemo(() => {
    return borrows.filter(
      (borrow) =>
        getDisplayStatus(borrow) ===
        "Due Today",
    ).length;
  }, [borrows]);

  const overdue = useMemo(() => {
    return borrows.filter(
      (borrow) =>
        getDisplayStatus(borrow) ===
        "Overdue",
    ).length;
  }, [borrows]);

  // =========================
  // SEARCH + TAB FILTER
  // =========================

  const filteredBorrows = useMemo(() => {
    let result = [...borrows];

    // Search
    if (search.trim()) {
      const searchText =
        search.toLowerCase();

      result = result.filter((borrow) => {
        const bookTitle =
          borrow.book?.title?.toLowerCase() ||
          "";

        const author =
          borrow.book?.author?.toLowerCase() ||
          "";

        const memberName =
          borrow.member?.fullName?.toLowerCase() ||
          "";

        const email =
          borrow.member?.email?.toLowerCase() ||
          "";

        return (
          bookTitle.includes(searchText) ||
          author.includes(searchText) ||
          memberName.includes(searchText) ||
          email.includes(searchText)
        );
      });
    }

    // Tabs
    if (activeTab === "due-soon") {
      result = result.filter((borrow) => {
        const status =
          getDisplayStatus(borrow);

        return (
          status === "Due Soon" ||
          status === "Due Today"
        );
      });
    }

    if (activeTab === "overdue") {
      result = result.filter(
        (borrow) =>
          getDisplayStatus(borrow) ===
          "Overdue",
      );
    }

    return result;
  }, [
    borrows,
    search,
    activeTab,
  ]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBorrows.length /
        itemsPerPage,
    ),
  );

  const displayPage = Math.min(
    currentPage,
    totalPages,
  );

  const paginatedBorrows =
    filteredBorrows.slice(
      (displayPage - 1) *
        itemsPerPage,
      displayPage * itemsPerPage,
    );

  // =========================
  // RETURN BOOK
  // =========================

  const handleReturn = async (
    borrowId: number,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await returnBook(borrowId);

      await loadBorrows();
    } catch (err) {
      console.error(
        "Failed to return book:",
        err,
      );

      alert(
        "Failed to return the book.",
      );
    }
  };

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-[#FAF3E9] text-[#4A362A]">
      {/* =========================
          HEADER
      ========================= */}

      <header className="fixed left-[264px] right-0 top-0 z-30 h-[72px] border-b border-[#E8DCC8] bg-[#FFF9F1]">
        <div className="flex h-full items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold">
              Borrows
            </h1>

            <p className="mt-1 text-xs text-[#806F61]">
              Monitor and manage borrowed books
            </p>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative rounded-lg p-2 text-[#806F61] hover:bg-[#F1E3D2]">
              <Bell className="h-5 w-5" />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C97B4A]" />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C97B4A] text-sm font-bold text-white">
              A
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="fixed bottom-0 left-0 top-0 z-40 w-[264px] border-r border-[#E8DCC8] bg-[#F1E3D2]">
        <div className="flex h-full flex-col">
          {/* Logo */}

          <div className="flex h-[72px] items-center border-b border-[#E5D7C7] px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C97B4A] text-white">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-[#4A362A]">
                  ShelfSphere
                </h2>

                <p className="text-[11px] text-[#806F61]">
                  Library Management
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}

          <nav className="flex-1 space-y-1 px-4 py-6">
            <a
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Dashboard
            </a>

            <a
              href="/dashboard/books"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Books
            </a>

            <a
              href="/dashboard/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Users
            </a>

            <a
              href="/dashboard/borrows"
              className="flex items-center gap-3 rounded-xl bg-[#C97B4A] px-4 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Borrows
            </a>

            <a
              href="/dashboard/reservations"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Reservations
            </a>

            <a
              href="/dashboard/categories"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Categories
            </a>

            <a
              href="/dashboard/fines"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Fines
            </a>

            <a
              href="/dashboard/reports"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C8] hover:bg-[#E8D8C5]"
            >
              Reports
            </a>
          </nav>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="ml-[264px] pt-[72px]">
        <div className="p-8">
          {/* Page heading */}

          <div className="mb-7 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#4A362A]">
                Borrow Management
              </h2>

              <p className="mt-1 text-sm text-[#806F61]">
                Track current loans, due dates,
                returns and fines.
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-[#C97B4A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B96C3D]">
              <Plus className="h-4 w-4" />
              New Borrow
            </button>
          </div>

          {/* Stats */}

          <BorrowStats
            activeLoans={activeLoans}
            dueToday={dueToday}
            overdue={overdue}
          />

          {/* Search */}

          <div className="mt-7 rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A08E7F]" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search books, users, borrows..."
                className="w-full rounded-xl border border-[#E5D7C7] bg-[#FFFCF7] py-3 pl-12 pr-4 text-sm text-[#4A362A] outline-none placeholder:text-[#A08E7F] focus:border-[#C97B4A]"
              />
            </div>
          </div>

          {/* Tabs + table */}

          <div className="mt-7">
            <BorrowTabs
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            />

            <div className="mt-5">
              {loading ? (
                <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] py-16 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E8DCC8] border-t-[#C97B4A]" />

                  <p className="mt-4 text-sm text-[#806F61]">
                    Loading borrow records...
                  </p>
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] px-6 py-12 text-center">
                  <p className="font-medium text-[#B23B2E]">
                    {error}
                  </p>

                  <button
                    onClick={loadBorrows}
                    className="mt-4 rounded-lg bg-[#C97B4A] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <BorrowTable
                  borrows={paginatedBorrows}
                  onReturn={handleReturn}
                  onDetails={setSelectedBorrow}
                />
              )}
            </div>
          </div>

          {/* Pagination */}

          {!loading &&
            !error &&
            filteredBorrows.length > 0 && (
              <div className="mt-5">
                <BorrowPagination
                  currentPage={displayPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
        </div>
      </main>

      {/* Details Modal */}

      <BorrowDetailsModal
        borrow={selectedBorrow}
        onClose={() =>
          setSelectedBorrow(null)
        }
      />
    </div>
  );
}