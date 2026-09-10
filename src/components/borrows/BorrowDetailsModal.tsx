"use client";

import { X } from "lucide-react";
import { BorrowRecord } from "@/types/borrow";
import FineBadge from "./FineBadge";

interface BorrowDetailsModalProps {
  borrow: BorrowRecord | null;
  onClose: () => void;
}

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

export default function BorrowDetailsModal({
  borrow,
  onClose,
}: BorrowDetailsModalProps) {
  if (!borrow) {
    return null;
  }

  const totalFine = (borrow.fines ?? []).reduce(
    (total, fine) => total + Number(fine.amount),
    0,
  );

  const hasFine = (borrow.fines ?? []).length > 0;

  const hasUnpaidFine = (borrow.fines ?? []).some(
    (fine) => !fine.paid,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#FFFDF9] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8DCC8] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#4A362A]">
              Borrow Details
            </h2>

            <p className="mt-1 text-sm text-[#806F61]">
              Borrow record #{borrow.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#806F61] hover:bg-[#F1E3D2]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#806F61]">
              Book
            </p>

            <p className="mt-1 text-lg font-bold text-[#4A362A]">
              {borrow.book.title}
            </p>

            <p className="text-sm text-[#806F61]">
              {borrow.book.author}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#806F61]">
              Borrower
            </p>

            <p className="mt-1 font-semibold text-[#4A362A]">
              {borrow.member.fullName}
            </p>

            <p className="text-sm text-[#806F61]">
              {borrow.member.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#806F61]">
                Borrow Date
              </p>

              <p className="mt-1 font-medium text-[#4A362A]">
                {formatDate(borrow.borrowedAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#806F61]">
                Due Date
              </p>

              <p className="mt-1 font-medium text-[#4A362A]">
                {formatDate(borrow.dueDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#806F61]">
                Returned Date
              </p>

              <p className="mt-1 font-medium text-[#4A362A]">
                {formatDate(borrow.returnedAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#806F61]">
                Status
              </p>

              <p className="mt-1 font-medium text-[#4A362A]">
                {borrow.status === "RETURNED"
                  ? "Returned"
                  : "Borrowed"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#E8DCC8] bg-[#FCF7F0] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#806F61]">
                  Fine
                </p>

                <p className="mt-1 text-lg font-bold text-[#4A362A]">
                  {hasFine
                    ? `৳${totalFine.toFixed(2)}`
                    : "No Fine"}
                </p>
              </div>

              <div>
                {hasFine ? (
                  <FineBadge borrow={borrow} />
                ) : (
                  <span className="rounded-full bg-[#E8F0E3] px-3 py-1 text-xs font-medium text-[#6B7A4F]">
                    No Fine
                  </span>
                )}
              </div>
            </div>

            {hasFine && (
              <p className="mt-2 text-xs text-[#806F61]">
                {hasUnpaidFine
                  ? "There is an unpaid fine on this borrow record."
                  : "All fines for this borrow record have been paid."}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-[#E8DCC8] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#C97B4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B96C3D]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
