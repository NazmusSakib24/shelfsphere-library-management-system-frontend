
"use client";

import {
  RotateCcw,
  Eye,
} from "lucide-react";

import { BorrowRecord } from "@/types/borrow";
import FineBadge from "./FineBadge";

interface BorrowTableProps {
  borrows: BorrowRecord[];

  onReturn: (borrowId: number) => void;

  onView: (borrow: BorrowRecord) => void;

  returningId?: number | null;
}

function getDisplayStatus(
  borrow: BorrowRecord,
) {
  if (borrow.status === "RETURNED") {
    return {
      label: "Returned",
      className:
        "bg-[#EAF0E2] text-[#6B7A4F]",
    };
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

  const days =
    Math.ceil(
      diff /
        (1000 * 60 * 60 * 24),
    );

  if (days < 0) {
    return {
      label: "Overdue",
      className:
        "bg-[#FCE8E5] text-[#B23B2E]",
    };
  }

  if (days === 0) {
    return {
      label: "Due Today",
      className:
        "bg-[#FFF3D6] text-[#B08828]",
    };
  }

  if (days <= 3) {
    return {
      label: "Due Soon",
      className:
        "bg-[#FFF3D6] text-[#B08828]",
    };
  }

  return {
    label: "Active",
    className:
      "bg-[#E8F0E5] text-[#6B7A4F]",
  };
}

export default function BorrowTable({
  borrows,
  onReturn,
  onView,
  returningId,
}: BorrowTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b border-[#E8DCC8] bg-[#F8F0E5]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#7A6A5B]">
                Book
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#7A6A5B]">
                Borrower
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#7A6A5B]">
                Borrow Date
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#7A6A5B]">
                Due Date
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#7A6A5B]">
                Status
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#7A6A5B]">
                Fine
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#7A6A5B]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EFE5D8]">
            {borrows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-[#7A6A5B]"
                >
                  No borrow records found.
                </td>
              </tr>
            ) : (
              borrows.map((borrow) => {
                const status =
                  getDisplayStatus(
                    borrow,
                  );

                return (
                  <tr
                    key={borrow.id}
                    className="transition hover:bg-[#FFF9F1]"
                  >
                    {/* Book */}
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-[#4A362A]">
                          {borrow.book
                            ?.title ??
                            "Unknown Book"}
                        </p>

                        <p className="mt-1 text-xs text-[#8A7868]">
                          {borrow.book
                            ?.author ??
                            "Unknown Author"}
                        </p>
                      </div>
                    </td>

                    {/* Borrower */}
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-[#4A362A]">
                          {borrow.member
                            ?.fullName ??
                            "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-[#8A7868]">
                          {borrow.member
                            ?.email ??
                            ""}
                        </p>
                      </div>
                    </td>

                    {/* Borrow Date */}
                    <td className="px-6 py-5 text-sm text-[#5E4B3D]">
                      {new Date(
                        borrow.borrowedAt,
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-5 text-sm text-[#5E4B3D]">
                      {new Date(
                        borrow.dueDate,
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* Fine */}
                    <td className="px-6 py-5">
                      <FineBadge
                        borrow={borrow}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() =>
                            onView(
                              borrow,
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C9B8] px-3 py-2 text-xs font-semibold text-[#5E4B3D] transition hover:bg-[#F5EBDD]"
                        >
                          <Eye className="h-3.5 w-3.5" />

                          View
                        </button>

                        {/* Return */}
                        {borrow.status ===
                          "BORROWED" && (
                          <button
                            type="button"
                            onClick={() =>
                              onReturn(
                                borrow.id,
                              )
                            }
                            disabled={
                              returningId ===
                              borrow.id
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#C97B4A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#B86A3D] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />

                            {returningId ===
                            borrow.id
                              ? "Returning..."
                              : "Return"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

