"use client";

import {
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";

import { BorrowDisplayStatus, BorrowRecord } from "@/types/borrow";
import FineBadge from "./FineBadge";

interface BorrowTableProps {
  borrows: BorrowRecord[];
  onReturn: (id: number) => void;
  onDetails: (borrow: BorrowRecord) => void;
}

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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function getStatusStyle(status: BorrowDisplayStatus) {
  switch (status) {
    case "Overdue":
      return "bg-[#F4DDD8] text-[#B23B2E]";

    case "Due Today":
      return "bg-[#F5EBD2] text-[#B08828]";

    case "Due Soon":
      return "bg-[#F5EBD2] text-[#B08828]";

    case "Returned":
      return "bg-[#E8F0E3] text-[#6B7A4F]";

    default:
      return "bg-[#E8F0E3] text-[#6B7A4F]";
  }
}

export default function BorrowTable({
  borrows,
  onReturn,
  onDetails,
}: BorrowTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#E8DCC8] bg-[#FCF7F0]">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Book
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Borrower
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Borrow Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Due Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Fine
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {borrows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-[#806F61]"
                >
                  No borrow records found.
                </td>
              </tr>
            ) : (
              borrows.map((borrow) => {
                const displayStatus =
                  getDisplayStatus(borrow);

                return (
                  <tr
                    key={borrow.id}
                    className="border-b border-[#EFE5D8] last:border-b-0 hover:bg-[#FFFAF4]"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-[#4A362A]">
                          {borrow.book.title}
                        </p>

                        <p className="mt-1 text-xs text-[#806F61]">
                          {borrow.book.author}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-[#4A362A]">
                          {borrow.member.fullName}
                        </p>

                        <p className="mt-1 text-xs text-[#806F61]">
                          {borrow.member.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#5F5045]">
                      {formatDate(borrow.borrowedAt)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#5F5045]">
                      {formatDate(borrow.dueDate)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          displayStatus,
                        )}`}
                      >
                        {displayStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <FineBadge fines={borrow.fines} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {borrow.status === "BORROWED" && (
                          <button
                            onClick={() =>
                              onReturn(borrow.id)
                            }
                            className="flex items-center gap-2 rounded-lg border border-[#D8C9B8] px-3 py-2 text-xs font-medium text-[#4A362A] transition hover:bg-[#F1E3D2]"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Return
                          </button>
                        )}

                        <button
                          onClick={() =>
                            onDetails(borrow)
                          }
                          className="rounded-lg p-2 text-[#806F61] transition hover:bg-[#F1E3D2] hover:text-[#4A362A]"
                          title="View details"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
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