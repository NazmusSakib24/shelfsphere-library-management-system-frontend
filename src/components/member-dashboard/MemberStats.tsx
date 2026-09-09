"use client";

import {
  FaBookOpen,
  FaBookmark,
  FaMoneyBillWave,
  FaHistory,
} from "react-icons/fa";

interface MemberStatsProps {
  borrowedBooks: number;
  reservedBooks: number;
  pendingFines: number;
  totalFineAmount: number;
  booksRead: number;
}

export default function MemberStats({
  borrowedBooks,
  reservedBooks,
  pendingFines,
  totalFineAmount,
  booksRead,
}: MemberStatsProps) {
  const stats = [
    {
      title: "My Borrowed Books",
      value: borrowedBooks,
      icon: FaBookOpen,
      description: "Currently borrowed",
      iconBg: "#F3E0D5",
      iconColor: "#C97B4A",
    },
    {
      title: "My Reservations",
      value: reservedBooks,
      icon: FaBookmark,
      description: "Books reserved",
      iconBg: "#E8EBD9",
      iconColor: "#6B7A4F",
    },
    {
      title: "Pending Fines",
      value: pendingFines,
      icon: FaMoneyBillWave,
      description: `Amount: ${Number(
        totalFineAmount,
      ).toFixed(2)}`,
      iconBg: "#F4E4D2",
      iconColor: "#B08828",
    },
    {
      title: "Books Read",
      value: booksRead,
      icon: FaHistory,
      description: "Returned books",
      iconBg: "#EBDDD8",
      iconColor: "#8C5748",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#806B5D]">
                  {stat.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#4A362A]">
                  {stat.value}
                </h3>

                <p className="mt-2 text-xs text-[#9B8778]">
                  {stat.description}
                </p>
              </div>

              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: stat.iconBg,
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: stat.iconColor,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}