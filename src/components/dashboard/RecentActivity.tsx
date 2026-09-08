import type { RecentActivity as Activity } from "@/services/dashboard";

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#2E211A]">
          Recent Activity
        </h3>

        <p className="mt-1 text-sm text-[#8C7B6B]">
          Latest library transactions
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="py-10 text-center text-sm text-[#8C7B6B]">
          No recent activity
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-xl bg-[#FAF3E9] p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E0D5] font-semibold text-[#C97B4A]">
                  {activity.memberName
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#2E211A]">
                    {activity.memberName}
                  </p>

                  <p className="mt-1 text-xs text-[#8C7B6B]">
                    {activity.bookTitle}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    activity.status === "BORROWED"
                      ? "bg-[#F3E0D5] text-[#C97B4A]"
                      : "bg-[#E5ECD9] text-[#6B7A4F]"
                  }`}
                >
                  {activity.status}
                </span>

                <p className="mt-2 text-xs text-[#8C7B6B]">
                  {new Date(
                    activity.borrowedAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}