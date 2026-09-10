"use client";

import { BorrowFine } from "@/types/borrow";

interface FineBadgeProps {
  fines?: BorrowFine[];
}

export default function FineBadge({
  fines = [],
}: FineBadgeProps) {
  if (fines.length === 0) {
    return (
      <span className="rounded-full bg-[#E8F0E3] px-3 py-1 text-xs font-medium text-[#6B7A4F]">
        No Fine
      </span>
    );
  }

  const unpaidFines = fines.filter((fine) => !fine.paid);

  const totalAmount = fines.reduce(
    (total, fine) => total + Number(fine.amount),
    0,
  );

  if (unpaidFines.length > 0) {
    return (
      <span className="rounded-full bg-[#F4DDD8] px-3 py-1 text-xs font-medium text-[#B23B2E]">
        ৳{totalAmount.toFixed(2)} Unpaid
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[#E8F0E3] px-3 py-1 text-xs font-medium text-[#6B7A4F]">
      ৳{totalAmount.toFixed(2)} Paid
    </span>
  );
}