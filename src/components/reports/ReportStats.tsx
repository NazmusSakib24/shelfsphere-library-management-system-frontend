import {
  TrendingUp,
  Clock,
  RotateCcw,
  BookOpen,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  circulationRate: number;
  newMembers: number;
  averageLoanDuration: number;
  returnRate: number;
}

export default function ReportStats({
  circulationRate,
  newMembers,
  averageLoanDuration,
  returnRate,
}: Props) {
  const stats = [
    {
      title: "Circulation Rate",
      value: `${circulationRate}%`,
      icon: TrendingUp,
      iconClass: "text-[#C96F4A]",
    },
    {
      title: "New Members",
      value: newMembers,
      icon: BookOpen,
      iconClass: "text-[#7C9A72]",
    },
    {
      title: "Avg. Loan Duration",
      value: `${averageLoanDuration} days`,
      icon: Clock,
      iconClass: "text-[#C8A95B]",
    },
    {
      title: "Return Rate",
      value: `${returnRate}%`,
      icon: RotateCcw,
      iconClass: "text-[#78A6C8]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="bg-[#FFFEFC]"
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[#8C7B6B]">
                {stat.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex items-end justify-between">
              <span className="text-3xl font-semibold text-[#2E211A]">
                {stat.value}
              </span>

              <Icon
                className={`size-8 ${stat.iconClass}`}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}