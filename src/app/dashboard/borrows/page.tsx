
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  BookOpen,
  CalendarClock,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  getBorrows,
  returnBook,
} from "@/services/borrows";

import { getFines } from "@/services/fines";

import {
  BorrowFine,
  BorrowRecord,
} from "@/types/borrow";

import BorrowTable from "@/components/borrows/BorrowTable";

interface BorrowStats {
  active: number;
  dueToday: number;
  overdue: number;
}

type TabType =
  | "ALL"
  | "DUE_SOON"
  | "OVERDUE";

function getStatus(
  borrow: BorrowRecord,
) {
  if (borrow.status === "RETURNED") {
    return "Returned";
  }

  const today = new Date();

  const dueDate = new Date(
    borrow.dueDate,
  );

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diff =
    dueDate.getTime() -
    today.getTime();

  const days = Math.ceil(
    diff /
      (1000 * 60 * 60 * 24),
  );

  if (days < 0) {
    return "Overdue";
  }

  if (days === 0) {
    return "Due Today";
  }

  if (days <= 3) {
    return "Due Soon";
  }

  return "Active";
}

export default function BorrowsPage() {
  const [borrows, setBorrows] =
    useState<BorrowRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<TabType>("ALL");

  const [returningId, setReturningId] =
    useState<number | null>(null);

  const [selectedBorrow, setSelectedBorrow] =
    useState<BorrowRecord | null>(null);

  /*
   * Load borrow records and fines.
   *
   * Backend:
   * GET /borrows
   * GET /fines
   *
   * We merge them on the frontend
   * using:
   *
   * fine.borrowRecord.id
   * =
   * borrow.id
   */
  const loadBorrows = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        borrowData,
        fineData,
      ] = await Promise.all([
        getBorrows(),
        getFines(),
      ]);

      /*
       * Create a map:
       *
       * borrow ID -> fines[]
       */
      const finesByBorrowId =
        new Map<
          number,
          BorrowFine[]
        >();

      fineData.forEach((fine) => {
        const borrowId =
          fine.borrowRecord?.id;

        if (!borrowId) {
          return;
        }

        const existing =
          finesByBorrowId.get(
            borrowId,
          ) ?? [];

        existing.push({
          id: fine.id,
          amount: fine.amount,
          paid: fine.paid,
          createdAt:
            fine.createdAt,
        });

        finesByBorrowId.set(
          borrowId,
          existing,
        );
      });

      /*
       * Merge fines into borrows.
       */
      const mergedBorrows =
        borrowData.map(
          (borrow) => ({
            ...borrow,

            fines:
              finesByBorrowId.get(
                borrow.id,
              ) ?? [],
          }),
        );

      setBorrows(
        mergedBorrows,
      );
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

  useEffect(() => {
    queueMicrotask(() => {
      void loadBorrows();
    });
  }, []);

  /*
   * Search + tab filtering
   */
  const filteredBorrows =
    useMemo(() => {
      let result = [...borrows];

      /*
       * Search
       */
      if (search.trim()) {
        const keyword =
          search
            .toLowerCase()
            .trim();

        result =
          result.filter(
            (borrow) =>
              borrow.book?.title
                ?.toLowerCase()
                .includes(
                  keyword,
                ) ||
              borrow.book?.author
                ?.toLowerCase()
                .includes(
                  keyword,
                ) ||
              borrow.member?.fullName
                ?.toLowerCase()
                .includes(
                  keyword,
                ) ||
              borrow.member?.email
                ?.toLowerCase()
                .includes(
                  keyword,
                ),
          );
      }

      /*
       * Tabs
       */
      if (
        activeTab ===
        "DUE_SOON"
      ) {
        result =
          result.filter(
            (borrow) => {
              const status =
                getStatus(
                  borrow,
                );

              return (
                status ===
                  "Due Soon" ||
                status ===
                  "Due Today"
              );
            },
          );
      }

      if (
        activeTab ===
        "OVERDUE"
      ) {
        result =
          result.filter(
            (borrow) =>
              getStatus(
                borrow,
              ) === "Overdue",
          );
      }

      return result;
    }, [
      borrows,
      search,
      activeTab,
    ]);

  /*
   * Statistics
   */
  const stats =
    useMemo<BorrowStats>(() => {
      return {
        active:
          borrows.filter(
            (borrow) =>
              borrow.status ===
              "BORROWED",
          ).length,

        dueToday:
          borrows.filter(
            (borrow) =>
              getStatus(
                borrow,
              ) ===
              "Due Today",
          ).length,

        overdue:
          borrows.filter(
            (borrow) =>
              getStatus(
                borrow,
              ) ===
              "Overdue",
          ).length,
      };
    }, [borrows]);

  /*
   * Return book
   */
  const handleReturn = async (
    borrowId: number,
  ) => {
    try {
      setReturningId(
        borrowId,
      );

      await returnBook(
        borrowId,
      );

      /*
       * Reload borrows + fines.
       *
       * This is important because
       * returning a late book can
       * automatically create a fine
       * in the backend.
       */
      await loadBorrows();
    } catch (err) {
      console.error(
        "Failed to return book:",
        err,
      );

      alert(
        "Failed to return the book.",
      );
    } finally {
      setReturningId(
        null,
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E9] p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4A362A]">
            Borrow Management
          </h1>

          <p className="mt-1 text-sm text-[#7A6A5B]">
            Monitor borrowed books,
            due dates and fines.
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadBorrows
          }
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C97B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B86A3D] disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-[#E7B9B2] bg-[#FCE8E5] p-4 text-sm font-medium text-[#B23B2E]">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        {/* Active */}
        <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#7A6A5B]">
                Active Loans
              </p>

              <p className="mt-2 text-3xl font-bold text-[#4A362A]">
                {stats.active}
              </p>
            </div>

            <div className="rounded-xl bg-[#F5EBDD] p-3">
              <BookOpen className="h-6 w-6 text-[#C97B4A]" />
            </div>
          </div>
        </div>

        {/* Due Today */}
        <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#7A6A5B]">
                Due Today
              </p>

              <p className="mt-2 text-3xl font-bold text-[#4A362A]">
                {stats.dueToday}
              </p>
            </div>

            <div className="rounded-xl bg-[#FFF3D6] p-3">
              <CalendarClock className="h-6 w-6 text-[#B08828]" />
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#7A6A5B]">
                Overdue
              </p>

              <p className="mt-2 text-3xl font-bold text-[#B23B2E]">
                {stats.overdue}
              </p>
            </div>

            <div className="rounded-xl bg-[#FCE8E5] p-3">
              <AlertTriangle className="h-6 w-6 text-[#B23B2E]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Tabs */}
      <div className="mb-6 rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8979]" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              placeholder="Search book, borrower or email..."
              className="w-full rounded-xl border border-[#D8C9B8] bg-[#FFFDF9] py-3 pl-10 pr-4 text-sm text-[#4A362A] outline-none transition placeholder:text-[#A89787] focus:border-[#C97B4A] focus:ring-2 focus:ring-[#C97B4A]/10"
            />
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-[#F5EBDD] p-1">
            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "ALL",
                )
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab ===
                "ALL"
                  ? "bg-[#FFFDF9] text-[#C97B4A] shadow-sm"
                  : "text-[#7A6A5B]"
              }`}
            >
              All Loans
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "DUE_SOON",
                )
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab ===
                "DUE_SOON"
                  ? "bg-[#FFFDF9] text-[#C97B4A] shadow-sm"
                  : "text-[#7A6A5B]"
              }`}
            >
              Due Soon
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "OVERDUE",
                )
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab ===
                "OVERDUE"
                  ? "bg-[#FFFDF9] text-[#C97B4A] shadow-sm"
                  : "text-[#7A6A5B]"
              }`}
            >
              Overdue
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-12 text-center shadow-sm">
          <RefreshCw className="mx-auto h-7 w-7 animate-spin text-[#C97B4A]" />

          <p className="mt-3 text-sm text-[#7A6A5B]">
            Loading borrow records...
          </p>
        </div>
      ) : (
        <BorrowTable
          borrows={
            filteredBorrows
          }
          onReturn={
            handleReturn
          }
          onView={
            setSelectedBorrow
          }
          returningId={
            returningId
          }
        />
      )}

      {/* Details Modal */}
      {selectedBorrow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelectedBorrow(
              null,
            )
          }
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#FFFDF9] p-6 shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#4A362A]">
                Borrow Details
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedBorrow(
                    null,
                  )
                }
                className="rounded-lg px-3 py-2 text-sm text-[#7A6A5B] hover:bg-[#F5EBDD]"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-[#9B8979]">
                  Book
                </p>

                <p className="mt-1 font-semibold text-[#4A362A]">
                  {
                    selectedBorrow
                      .book
                      ?.title
                  }
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-[#9B8979]">
                  Borrower
                </p>

                <p className="mt-1 font-semibold text-[#4A362A]">
                  {
                    selectedBorrow
                      .member
                      ?.fullName
                  }
                </p>

                <p className="text-sm text-[#7A6A5B]">
                  {
                    selectedBorrow
                      .member
                      ?.email
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#9B8979]">
                    Borrow Date
                  </p>

                  <p className="mt-1 text-sm text-[#4A362A]">
                    {new Date(
                      selectedBorrow.borrowedAt,
                    ).toLocaleDateString(
                      "en-GB",
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-[#9B8979]">
                    Due Date
                  </p>

                  <p className="mt-1 text-sm text-[#4A362A]">
                    {new Date(
                      selectedBorrow.dueDate,
                    ).toLocaleDateString(
                      "en-GB",
                    )}
                  </p>
                </div>
              </div>

              {/* Fine Details */}
              <div className="rounded-xl bg-[#F8F0E5] p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#7A6A5B]">
                  Fine
                </p>

                {(() => {
                  const fines = selectedBorrow.fines ?? [];

                  /*
                   * If an actual fine already exists,
                   * show the actual fine.
                   */
                  if (fines.length > 0) {
                    const totalFine = fines.reduce(
                      (sum, fine) => sum + Number(fine.amount),
                      0,
                    );

                    const hasUnpaidFine = fines.some(
                      (fine) => !fine.paid,
                    );

                    return (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#4A362A]">
                            Total Fine
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              hasUnpaidFine
                                ? "bg-[#FCE8E5] text-[#B23B2E]"
                                : "bg-[#EAF0E2] text-[#6B7A4F]"
                            }`}
                          >
                            ৳{totalFine.toFixed(2)} {hasUnpaidFine ? "Unpaid" : "Paid"}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-[#8A7868]">
                          This is the actual fine recorded for this borrow.
                        </p>
                      </div>
                    );
                  }

                  /*
                   * No actual fine.
                   * Calculate projected fine if the
                   * book is returned today.
                   */
                  const today = new Date();
                  const dueDate = new Date(selectedBorrow.dueDate);

                  today.setHours(0, 0, 0, 0);
                  dueDate.setHours(0, 0, 0, 0);

                  const difference =
                    today.getTime() - dueDate.getTime();

                  const lateDays = Math.floor(
                    difference / (1000 * 60 * 60 * 24),
                  );

                  /*
                   * Book is not overdue.
                   */
                  if (lateDays <= 0) {
                    return (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#4A362A]">
                            Current Fine
                          </span>

                          <span className="rounded-full bg-[#EAF0E2] px-3 py-1 text-xs font-bold text-[#6B7A4F]">
                            ৳0.00
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-[#8A7868]">
                          No fine would be imposed if the book is returned today.
                        </p>
                      </div>
                    );
                  }

                  /*
                   * Book is overdue.
                   *
                   * Fine = late days × ৳10
                   */
                  const projectedFine = lateDays * 10;

                  return (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#4A362A]">
                          Estimated Fine
                        </span>

                        <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#B08828]">
                          ৳{projectedFine.toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-3 rounded-lg bg-[#FFFDF9] p-3">
                        <div className="flex justify-between text-xs text-[#7A6A5B]">
                          <span>Days overdue</span>

                          <span className="font-semibold text-[#4A362A]">
                            {lateDays} {lateDays === 1 ? "day" : "days"}
                          </span>
                        </div>

                        <div className="mt-1 flex justify-between text-xs text-[#7A6A5B]">
                          <span>Fine per day</span>

                          <span className="font-semibold text-[#4A362A]">
                            ৳10.00
                          </span>
                        </div>

                        <div className="mt-2 border-t border-[#E8DCC8] pt-2">
                          <div className="flex justify-between text-sm font-bold text-[#B08828]">
                            <span>Estimated total</span>

                            <span>৳{projectedFine.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-[#8A7868]">
                        This is the estimated fine if the book is returned today.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


