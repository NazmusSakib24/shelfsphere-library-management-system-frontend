"use client";

import {
  FaBookOpen,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import { MemberActivity } from "@/services/member-dashboard";

interface ActivityFeedProps {
  activities: MemberActivity[];
}

export default function ActivityFeed({
  activities,
}: ActivityFeedProps) {
  return (
    <section
      id="activity"
      className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] shadow-sm"
    >
      <div className="border-b border-[#EFE5D8] p-6">
        <h2 className="text-lg font-bold text-[#4A362A]">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-[#8A7567]">
          Your latest library activity
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="p-10 text-center">
          <FaClock
            className="mx-auto mb-3 text-[#CDBEAF]"
            size={30}
          />

          <p className="font-medium text-[#6D594C]">
            No recent activity
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#EFE5D8]">
          {activities.map((activity) => {
            const returned =
              activity.status === "RETURNED";

            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-5"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    returned
                      ? "bg-[#E5EBD9]"
                      : "bg-[#F3E0D5]"
                  }`}
                >
                  {returned ? (
                    <FaCheckCircle
                      className="text-[#6B7A4F]"
                      size={16}
                    />
                  ) : (
                    <FaBookOpen
                      className="text-[#C97B4A]"
                      size={16}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#4A362A]">
                    {returned
                      ? "Returned"
                      : "Borrowed"}{" "}
                    <span className="font-semibold">
                      {activity.bookTitle}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-[#9B8778]">
                    {new Date(
                      activity.borrowedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    returned
                      ? "bg-[#E5EBD9] text-[#59683E]"
                      : "bg-[#F3E0D5] text-[#8A5B40]"
                  }`}
                >
                  {returned
                    ? "Returned"
                    : "Borrowed"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}