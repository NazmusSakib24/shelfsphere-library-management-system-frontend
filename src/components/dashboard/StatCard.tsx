import { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: IconType;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "#C97B4A",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#8C7B6B]">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#2E211A]">
            {value}
          </h2>

          <p className="mt-2 text-xs text-[#6B5B4D]">
            {subtitle}
          </p>
        </div>

        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${iconColor}18`,
            color: iconColor,
          }}
        >
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  );
}