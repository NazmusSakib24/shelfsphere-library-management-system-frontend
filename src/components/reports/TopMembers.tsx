import { TopMember } from "@/services/reports";

interface Props {
  members: TopMember[];
}

export default function TopMembers({
  members,
}: Props) {
  const maxBorrowCount =
    members.length > 0
      ? Math.max(
          ...members.map((member) =>
            Number(member.borrowCount)
          )
        )
      : 1;

  return (
    <div className="flex flex-col gap-4">
      {members.map((member, index) => {
        const borrowCount = Number(
          member.borrowCount
        );

        const percentage =
          (borrowCount / maxBorrowCount) * 100;

        return (
          <div
            key={`${member.member}-${index}`}
            className="flex items-center gap-4"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F3EAE0] text-sm font-semibold text-[#6B5B4D]">
              {index + 1}
            </div>

            <div className="w-48 shrink-0">
              <p className="truncate text-sm font-semibold text-[#2E211A]">
                {member.member}
              </p>
            </div>

            <div className="h-2.5 flex-1 rounded-full bg-[#F3EAE0]">
              <div
                className="h-full rounded-full bg-[#7C9A72]"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <span className="w-20 shrink-0 text-right text-[13px] text-[#6B5B4D]">
              {borrowCount} loans
            </span>
          </div>
        );
      })}
    </div>
  );
}