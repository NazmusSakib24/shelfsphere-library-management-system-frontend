"use client";

import {
  CheckCircle,
  MoreHorizontal,
  CreditCard,
} from "lucide-react";

import { Fine } from "@/types/fine";

interface FineTableProps {
  fines: Fine[];
  onPay: (id: number) => void;
  onDetails: (fine: Fine) => void;
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

export default function FineTable({
  fines,
  onPay,
  onDetails,
}: FineTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed">
          <thead>
            <tr className="border-b border-[#E8DCC8] bg-[#FCF7F0]">
              <th className="w-[28%] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Borrower
              </th>

              <th className="w-[12%] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Borrow ID
              </th>

              <th className="w-[15%] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Fine Date
              </th>

              <th className="w-[12%] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Amount
              </th>

              <th className="w-[15%] px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Status
              </th>

              <th className="w-[18%] px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#806F61]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {fines.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-[#806F61]"
                >
                  No fines found.
                </td>
              </tr>
            ) : (
              fines.map((fine) => (
                <tr
                  key={fine.id}
                  className="border-b border-[#EFE5D8] last:border-b-0 hover:bg-[#FFFAF4]"
                >
                  <td className="px-5 py-4 align-middle">
                    <div>
                      <p className="font-semibold text-[#4A362A]">
                        {fine.borrowRecord?.member?.fullName ||
                          "Unknown Member"}
                      </p>

                      <p className="mt-1 text-xs text-[#806F61]">
                        {fine.borrowRecord?.member?.email ||
                          "No email"}
                      </p>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 align-middle">
                    <span className="font-medium text-[#4A362A]">
                      #{fine.borrowRecord?.id}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 align-middle text-sm text-[#5F5045]">
                    {formatDate(fine.createdAt)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 align-middle">
                    <span className="font-semibold text-[#4A362A]">
                      ৳{Number(fine.amount).toFixed(2)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-center align-middle">
                    {fine.paid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F0E3] px-3 py-1 text-xs font-semibold text-[#6B7A4F]">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#F4DDD8] px-3 py-1 text-xs font-semibold text-[#B23B2E]">
                        Unpaid
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 align-middle">
                    <div className="flex min-h-9 items-center justify-end gap-2">
                      {!fine.paid && (
                        <button
                          onClick={() => onPay(fine.id)}
                          className="inline-flex h-9 min-w-[76px] items-center justify-center gap-2 rounded-lg border border-[#D8C9B8] px-3 py-2 text-xs font-medium text-[#4A362A] transition hover:bg-[#F1E3D2]"
                        >
                          <CreditCard className="h-4 w-4" />
                          Pay
                        </button>
                      )}

                      <button
                        onClick={() => onDetails(fine)}
                        className="rounded-lg p-2 text-[#806F61] transition hover:bg-[#F1E3D2] hover:text-[#4A362A]"
                        title="View details"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
