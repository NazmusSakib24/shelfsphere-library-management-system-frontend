
import {
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { BorrowRecord } from "@/types/borrow";

interface FineBadgeProps {
  borrow: BorrowRecord;
}

const FINE_PER_DAY = 10;

export default function FineBadge({
  borrow,
}: FineBadgeProps) {
  const fines = borrow.fines ?? [];

  /*
   * If an actual fine already exists,
   * show the actual fine.
   */
  if (fines.length > 0) {
    const totalFine = fines.reduce(
      (sum, fine) =>
        sum + Number(fine.amount),
      0,
    );

    const hasUnpaidFine = fines.some(
      (fine) => !fine.paid,
    );

    if (hasUnpaidFine) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE8E5] px-3 py-1 text-xs font-semibold text-[#B23B2E]">
          <AlertCircle className="h-3.5 w-3.5" />

          ৳{totalFine.toFixed(2)} Unpaid
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF0E2] px-3 py-1 text-xs font-semibold text-[#6B7A4F]">
        <CheckCircle2 className="h-3.5 w-3.5" />

        ৳{totalFine.toFixed(2)} Paid
      </span>
    );
  }

  /*
   * If there is no actual fine yet,
   * calculate how much fine would be
   * imposed if the book is returned today.
   */

  const today = new Date();

  const dueDate = new Date(
    borrow.dueDate,
  );

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const difference =
    today.getTime() -
    dueDate.getTime();

  const lateDays = Math.floor(
    difference /
      (1000 * 60 * 60 * 24),
  );

  /*
   * Not overdue yet.
   */
  if (lateDays <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EEE7] px-3 py-1 text-xs font-semibold text-[#7A6A5B]">
        <Clock className="h-3.5 w-3.5" />

        ৳0.00
      </span>
    );
  }

  /*
   * Calculate projected fine.
   */
  const projectedFine =
    lateDays * FINE_PER_DAY;

  return (
    <div className="flex flex-col">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-semibold text-[#B08828]">
        <Clock className="h-3.5 w-3.5" />

        ৳{projectedFine.toFixed(2)}
      </span>

      <span className="mt-1 text-[11px] text-[#9B8979]">
        {lateDays}{" "}
        {lateDays === 1
          ? "day"
          : "days"}{" "}
        late
      </span>
    </div>
  );
}

