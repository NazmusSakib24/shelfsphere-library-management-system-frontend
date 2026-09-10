"use client";

import {
  CircleDollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";

interface FineStatsProps {
  totalFines: number;
  paidFines: number;
  unpaidFines: number;
  totalAmount: number;
}

export default function FineStats({
  totalFines,
  paidFines,
  unpaidFines,
  totalAmount,
}: FineStatsProps) {
  const stats = [
    {
      title: "Total Fines",
      value: totalFines,
      icon: CircleDollarSign,
      iconBg: "bg-[#F5EBD2]",
      iconColor: "text-[#B08828]",
    },
    {
      title: "Paid Fines",
      value: paidFines,
      icon: CheckCircle,
      iconBg: "bg-[#E8F0E3]",
      iconColor: "text-[#6B7A4F]",
    },
    {
      title: "Unpaid Fines",
      value: unpaidFines,
      icon: Clock,
      iconBg: "bg-[#F4DDD8]",
      iconColor: "text-[#B23B2E]",
    },
    {
      title: "Total Amount",
      value: `৳${totalAmount.toFixed(2)}`,
      icon: CircleDollarSign,
      iconBg: "bg-[#F1E3D2]",
      iconColor: "text-[#C97B4A]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#806F61]">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#4A362A]">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <Icon
                  className={`h-6 w-6 ${stat.iconColor}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}