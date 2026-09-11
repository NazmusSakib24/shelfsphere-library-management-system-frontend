"use client";

import { BorrowRecord } from "@/types/borrow";

interface FineBadgeProps {
  borrow: BorrowRecord;
}

export default function FineBadge({
  borrow,
}: FineBadgeProps) {
  const fines = borrow.fines ?? [];

  // Actual fine exists in database
  if (fines.length > 0) {
    const totalFine = fines.reduce(
      (sum, fine) =>
        sum + Number(fine.amount),
      0,
    );

    const unpaid = fines.some(
      (fine) => !fine.paid,
    );

    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
          unpaid
            ? "bg-[#FCE8E5] text-[#B23B2E]"
            : "bg-[#EAF0E2] text-[#6B7A4F]"
        }`}
      >
        ৳{totalFine.toFixed(2)}
      </span>
    );
  }

  // Calculate estimated fine
  if (borrow.status === "RETURNED") {
    return (
      <span className="text-xs text-[#8A7868]">
        No Fine
      </span>
    );
  }

  const today = new Date();
  const dueDate = new Date(
    borrow.dueDate,
  );

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const lateDays = Math.floor(
    (today.getTime() -
      dueDate.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (lateDays <= 0) {
    return (
      <span className="text-xs text-[#6B7A4F]">
        ৳0.00
      </span>
    );
  }

  const estimatedFine =
    lateDays * 10;

  return (
    <span className="inline-flex rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#B08828]">
      ৳{estimatedFine}
    </span>
  );
}