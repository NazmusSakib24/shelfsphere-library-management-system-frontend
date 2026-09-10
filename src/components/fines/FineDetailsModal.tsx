"use client";

import { X } from "lucide-react";

import { Fine } from "@/types/fine";

interface FineDetailsModalProps {
  fine: Fine | null;
  onClose: () => void;
}

function formatDate(date?: string | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

export default function FineDetailsModal({
  fine,
  onClose,
}: FineDetailsModalProps) {
  if (!fine) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#FFFDF9] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8DCC8] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#4A362A]">
              Fine Details
            </h2>

            <p className="mt-1 text-sm text-[#806F61]">
              Fine #{fine.id}
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
              Borrower
            </p>

            <p className="mt-1 text-lg font-bold text-[#4A362A]">
              {fine.borrowRecord?.member?.fullName ||
                "Unknown Member"}
            </p>

            <p className="text-sm text-[#806F61]">
              {fine.borrowRecord?.member?.email ||
                "No email"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#806F61]">
                Borrow ID
              </p>

              <p className="mt-1 font-semibold text-[#4A362A]">
                #{fine.borrowRecord?.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#806F61]">
                Fine Date
              </p>

              <p className="mt-1 font-semibold text-[#4A362A]">
                {formatDate(fine.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#806F61]">
                Borrow Date
              </p>

              <p className="mt-1 font-semibold text-[#4A362A]">
                {formatDate(
                  fine.borrowRecord?.borrowedAt,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#806F61]">
                Due Date
              </p>

              <p className="mt-1 font-semibold text-[#4A362A]">
                {formatDate(
                  fine.borrowRecord?.dueDate,
                )}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#E8DCC8] bg-[#FCF7F0] p-5">
            <p className="text-xs text-[#806F61]">
              Fine Amount
            </p>

            <p className="mt-1 text-3xl font-bold text-[#C97B4A]">
              ৳{Number(fine.amount).toFixed(2)}
            </p>

            <div className="mt-3">
              {fine.paid ? (
                <span className="rounded-full bg-[#E8F0E3] px-3 py-1 text-xs font-semibold text-[#6B7A4F]">
                  Paid
                </span>
              ) : (
                <span className="rounded-full bg-[#F4DDD8] px-3 py-1 text-xs font-semibold text-[#B23B2E]">
                  Unpaid
                </span>
              )}
            </div>
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