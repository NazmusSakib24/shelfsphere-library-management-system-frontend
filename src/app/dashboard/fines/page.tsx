"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Plus,
  Search,
} from "lucide-react";

import FineStats from "@/components/fines/FineStats";
import FineTable from "@/components/fines/FineTable";
import FineDetailsModal from "@/components/fines/FineDetailsModal";
import FinePagination from "@/components/fines/FinePagination";

import {
  getFines,
  payFine,
} from "@/services/fines";

import { Fine } from "@/types/fine";

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedFine, setSelectedFine] =
    useState<Fine | null>(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;

  // =========================
  // LOAD FINES
  // =========================

  const loadFines = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFines();

      setFines(data);
    } catch (err) {
      console.error(
        "Failed to load fines:",
        err,
      );

      setError("Failed to load fines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadFines();
    });
  }, []);

  // =========================
  // STATISTICS
  // =========================

  const totalFines = fines.length;

  const paidFines = useMemo(() => {
    return fines.filter(
      (fine) => fine.paid,
    ).length;
  }, [fines]);

  const unpaidFines = useMemo(() => {
    return fines.filter(
      (fine) => !fine.paid,
    ).length;
  }, [fines]);

  const totalAmount = useMemo(() => {
    return fines.reduce(
      (total, fine) =>
        total + Number(fine.amount),
      0,
    );
  }, [fines]);

  // =========================
  // SEARCH
  // =========================

  const filteredFines = useMemo(() => {
    if (!search.trim()) {
      return fines;
    }

    const searchText =
      search.toLowerCase();

    return fines.filter((fine) => {
      const memberName =
        fine.borrowRecord?.member?.fullName?.toLowerCase() ||
        "";

      const email =
        fine.borrowRecord?.member?.email?.toLowerCase() ||
        "";

      const borrowId =
        String(
          fine.borrowRecord?.id || "",
        );

      const fineId =
        String(fine.id);

      return (
        memberName.includes(searchText) ||
        email.includes(searchText) ||
        borrowId.includes(searchText) ||
        fineId.includes(searchText)
      );
    });
  }, [fines, search]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredFines.length /
        itemsPerPage,
    ),
  );

  const displayPage = Math.min(
    currentPage,
    totalPages,
  );

  const paginatedFines =
    filteredFines.slice(
      (displayPage - 1) *
        itemsPerPage,
      displayPage * itemsPerPage,
    );

  // =========================
  // PAY FINE
  // =========================

  const handlePayFine = async (
    fineId: number,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this fine as paid?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await payFine(fineId);

      await loadFines();

      setSelectedFine(null);
    } catch (err) {
      console.error(
        "Failed to pay fine:",
        err,
      );

      alert(
        "Failed to mark fine as paid.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E9] text-[#4A362A]">
      {/* =========================
          HEADER
      ========================= */}

      <header className="hidden fixed left-[264px] right-0 top-0 z-30 h-[72px] border-b border-[#E8DCC8] bg-[#FFF9F1]">
        <div className="flex h-full items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold">
              Fines
            </h1>

            <p className="mt-1 text-xs text-[#806F61]">
              Manage library fines and payments
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

      <aside className="hidden fixed bottom-0 left-0 top-0 z-40 w-[264px] border-r border-[#E8DCC8] bg-[#F1E3D2]">
        <div className="flex h-full flex-col">
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

          <nav className="flex-1 space-y-1 px-4 py-6">
            <a
              href="/dashboard"
              className="flex rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Dashboard
            </a>

            <a
              href="/dashboard/books"
              className="flex rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Books
            </a>

            <a
              href="/dashboard/users"
              className="flex rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Users
            </a>

            <a
              href="/dashboard/borrows"
              className="flex rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Borrows
            </a>

            <a
              href="/dashboard/reservations"
              className="flex rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Reservations
            </a>

            <a
              href="/dashboard/categories"
              className="flex rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Categories
            </a>

            <a
              href="/dashboard/fines"
              className="flex rounded-xl bg-[#C97B4A] px-4 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Fines
            </a>

            <a
              href="/dashboard/reports"
              className="flex rounded-xl px-4 py-3 text-sm font-medium text-[#806F61] hover:bg-[#E8D8C5]"
            >
              Reports
            </a>
          </nav>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="min-h-screen pt-8">
        <div className="p-8">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#4A362A]">
                Fine Management
              </h2>

              <p className="mt-1 text-sm text-[#806F61]">
                Track fines, outstanding payments,
                and payment status.
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-[#C97B4A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B96C3D]">
              <Plus className="h-4 w-4" />
              New Fine
            </button>
          </div>

          {/* Stats */}

          <FineStats
            totalFines={totalFines}
            paidFines={paidFines}
            unpaidFines={unpaidFines}
            totalAmount={totalAmount}
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
                placeholder="Search borrower, email, borrow ID, fine ID..."
                className="w-full rounded-xl border border-[#E5D7C7] bg-[#FFFCF7] py-3 pl-12 pr-4 text-sm text-[#4A362A] outline-none placeholder:text-[#A08E7F] focus:border-[#C97B4A]"
              />
            </div>
          </div>

          {/* Table */}

          <div className="mt-7">
            {loading ? (
              <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] py-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E8DCC8] border-t-[#C97B4A]" />

                <p className="mt-4 text-sm text-[#806F61]">
                  Loading fines...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] px-6 py-12 text-center">
                <p className="font-medium text-[#B23B2E]">
                  {error}
                </p>

                <button
                  onClick={loadFines}
                  className="mt-4 rounded-lg bg-[#C97B4A] px-4 py-2 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <FineTable
                fines={paginatedFines}
                onPay={handlePayFine}
                onDetails={setSelectedFine}
              />
            )}
          </div>

          {/* Pagination */}

          {!loading &&
            !error &&
            filteredFines.length > 0 && (
              <div className="mt-5">
                <FinePagination
                  currentPage={displayPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
        </div>
      </main>

      {/* Details Modal */}

      <FineDetailsModal
        fine={selectedFine}
        onClose={() =>
          setSelectedFine(null)
        }
      />
    </div>
  );
}
