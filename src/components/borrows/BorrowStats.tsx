"use client";

import { BookOpen, Clock, AlertTriangle } from "lucide-react";

interface BorrowStatsProps {
  activeLoans: number;
  dueToday: number;
  overdue: number;
}

export default function BorrowStats({
  activeLoans,
  dueToday,
  overdue,
}: BorrowStatsProps) {
  const stats = [
    {
      title: "Active Loans",
      value: activeLoans,
      icon: BookOpen,
      iconBg: "bg-[#E8F0E3]",
      iconColor: "text-[#6B7A4F]",
    },
    {
      title: "Due Today",
      value: dueToday,
      icon: Clock,
      iconBg: "bg-[#F5EBD2]",
      iconColor: "text-[#B08828]",
    },
    {
      title: "Overdue",
      value: overdue,
      icon: AlertTriangle,
      iconBg: "bg-[#F4DDD8]",
      iconColor: "text-[#B23B2E]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

                <p className="mt-2 text-3xl font-bold text-[#4A362A]">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}