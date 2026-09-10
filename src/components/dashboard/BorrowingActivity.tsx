
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getBorrows } from "@/services/borrows";
import { BorrowRecord } from "@/types/borrow";

type Range = "7D" | "30D" | "3M" | "1Y";

interface ChartPoint {
  date: string;
  label: string;
  borrowed: number;
  returned: number;
}

const RANGE_DAYS: Record<Range, number> = {
  "7D": 7,
  "30D": 30,
  "3M": 90,
  "1Y": 365,
};

export default function BorrowActivityChart() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [range, setRange] = useState<Range>("30D");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBorrowed, setShowBorrowed] =
    useState(true);

  const [showReturned, setShowReturned] =
    useState(true);

  /*
   * Load real borrow data from backend.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBorrows();

        setBorrows(data);
      } catch (err) {
        console.error(
          "Failed to load borrow activity:",
          err,
        );

        setError(
          "Unable to load borrowing activity.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /*
   * Create chart data according to
   * selected range.
   */
  const chartData = useMemo<ChartPoint[]>(() => {
    const days = RANGE_DAYS[range];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);

    startDate.setDate(
      today.getDate() - (days - 1),
    );

    /*
     * For 1 year, group by month.
     * For shorter ranges, use daily points.
     */
    if (range === "1Y") {
      const months: ChartPoint[] = [];

      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);

        date.setMonth(
          today.getMonth() - i,
        );

        date.setDate(1);
        date.setHours(0, 0, 0, 0);

        const nextMonth = new Date(date);

        nextMonth.setMonth(
          date.getMonth() + 1,
        );

        const borrowed = borrows.filter(
          (borrow) => {
            const borrowedDate =
              new Date(
                borrow.borrowedAt,
              );

            return (
              borrowedDate >= date &&
              borrowedDate < nextMonth
            );
          },
        ).length;

        const returned = borrows.filter(
          (borrow) => {
            if (
              borrow.status !==
                "RETURNED" ||
              !borrow.returnedAt
            ) {
              return false;
            }

            const returnedDate =
              new Date(
                borrow.returnedAt,
              );

            return (
              returnedDate >= date &&
              returnedDate < nextMonth
            );
          },
        ).length;

        months.push({
          date:
            date.toISOString(),
          label: date.toLocaleDateString(
            "en-US",
            {
              month: "short",
            },
          ),
          borrowed,
          returned,
        });
      }

      return months;
    }

    /*
     * Daily chart for 7D / 30D / 3M.
     */
    const daysData: ChartPoint[] = [];

    for (
      let i = 0;
      i < days;
      i++
    ) {
      const date = new Date(
        startDate,
      );

      date.setDate(
        startDate.getDate() + i,
      );

      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);

      nextDay.setDate(
        date.getDate() + 1,
      );

      const borrowed = borrows.filter(
        (borrow) => {
          const borrowedDate =
            new Date(
              borrow.borrowedAt,
            );

          return (
            borrowedDate >= date &&
            borrowedDate < nextDay
          );
        },
      ).length;

      const returned = borrows.filter(
        (borrow) => {
          if (
            borrow.status !==
              "RETURNED" ||
            !borrow.returnedAt
          ) {
            return false;
          }

          const returnedDate =
            new Date(
              borrow.returnedAt,
            );

          return (
            returnedDate >= date &&
            returnedDate < nextDay
          );
        },
      ).length;

      let label = "";

      if (range === "7D") {
        label =
          date.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            },
          );
      } else if (range === "30D") {
        label =
          date.toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "short",
            },
          );
      } else {
        label =
          date.toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "short",
            },
          );
      }

      daysData.push({
        date: date.toISOString(),
        label,
        borrowed,
        returned,
      });
    }

    return daysData;
  }, [borrows, range]);

  /*
   * Calculate summary numbers.
   */
  const totalBorrowed = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum + item.borrowed,
      0,
    );
  }, [chartData]);

  const totalReturned = useMemo(() => {
    return chartData.reduce(
      (sum, item) =>
        sum + item.returned,
      0,
    );
  }, [chartData]);

  const netActivity =
    totalBorrowed - totalReturned;

  /*
   * Find highest activity point.
   */
  const peakActivity = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }

    return Math.max(
      ...chartData.map(
        (item) =>
          item.borrowed +
          item.returned,
      ),
    );
  }, [chartData]);

  return (
    <div className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#2E211A]">
              Borrowing Activity
            </h2>

            <span className="rounded-full bg-[#F3E0D5] px-2 py-0.5 text-[10px] font-semibold text-[#C97B4A]">
              LIVE
            </span>
          </div>

          <p className="mt-1 text-xs text-[#8C7B6B]">
            Library circulation performance
          </p>
        </div>

        {/* Range selector */}
        <div className="flex rounded-xl border border-[#E8DCC8] bg-[#FAF3E9] p-1">
          {(
            [
              "7D",
              "30D",
              "3M",
              "1Y",
            ] as Range[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setRange(item)
              }
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                range === item
                  ? "bg-[#C97B4A] text-white shadow-sm"
                  : "text-[#8C7B6B] hover:bg-[#E8DCC8]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-[#FAF3E9] p-3">
          <p className="text-[11px] text-[#8C7B6B]">
            Borrowed
          </p>

          <p className="mt-1 text-xl font-bold text-[#2E211A]">
            {totalBorrowed}
          </p>
        </div>

        <div className="rounded-xl bg-[#FAF3E9] p-3">
          <p className="text-[11px] text-[#8C7B6B]">
            Returned
          </p>

          <p className="mt-1 text-xl font-bold text-[#2E211A]">
            {totalReturned}
          </p>
        </div>

        <div className="rounded-xl bg-[#FAF3E9] p-3">
          <p className="text-[11px] text-[#8C7B6B]">
            Net active
          </p>

          <p
            className={`mt-1 text-xl font-bold ${
              netActivity > 0
                ? "text-[#C97B4A]"
                : "text-[#6B7A4F]"
            }`}
          >
            {netActivity > 0
              ? `+${netActivity}`
              : netActivity}
          </p>
        </div>

        <div className="rounded-xl bg-[#FAF3E9] p-3">
          <p className="text-[11px] text-[#8C7B6B]">
            Peak activity
          </p>

          <p className="mt-1 text-xl font-bold text-[#2E211A]">
            {peakActivity}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5 h-[300px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-[#8C7B6B]">
              Loading activity...
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-xl bg-[#FCE8E5] px-4 py-3 text-sm text-[#B23B2E]">
              {error}
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-[#8C7B6B]">
              No borrowing activity yet.
            </div>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="borrowGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#C97B4A"
                    stopOpacity={0.28}
                  />

                  <stop
                    offset="100%"
                    stopColor="#C97B4A"
                    stopOpacity={0.02}
                  />
                </linearGradient>

                <linearGradient
                  id="returnGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6B7A4F"
                    stopOpacity={0.22}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6B7A4F"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#EFE5D8"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#8C7B6B",
                  fontSize: 11,
                }}
                minTickGap={20}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#8C7B6B",
                  fontSize: 11,
                }}
              />

              <Tooltip
                cursor={{
                  stroke:
                    "#D8C9B8",
                  strokeWidth: 1,
                  strokeDasharray:
                    "4 4",
                }}
                contentStyle={{
                  background:
                    "#FFFDF9",
                  border:
                    "1px solid #E8DCC8",
                  borderRadius:
                    "12px",
                  padding:
                    "10px 12px",
                  boxShadow:
                    "0 8px 25px rgba(74, 54, 42, 0.10)",
                }}
                labelStyle={{
                  color: "#2E211A",
                  fontWeight: 700,
                  marginBottom: 5,
                }}
                formatter={(
                  value,
                  name,
                ) => [
                  value,
                  name ===
                  "borrowed"
                    ? "Borrowed"
                    : "Returned",
                ]}
              />

              {showBorrowed && (
                <Area
                  type="monotone"
                  dataKey="borrowed"
                  name="borrowed"
                  stroke="#C97B4A"
                  strokeWidth={2.5}
                  fill="url(#borrowGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                  }}
                  animationDuration={
                    700
                  }
                />
              )}

              {showReturned && (
                <Area
                  type="monotone"
                  dataKey="returned"
                  name="returned"
                  stroke="#6B7A4F"
                  strokeWidth={2.5}
                  fill="url(#returnGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                  }}
                  animationDuration={
                    700
                  }
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend / Toggle */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setShowBorrowed(
              !showBorrowed,
            )
          }
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            showBorrowed
              ? "bg-[#F3E0D5] text-[#C97B4A]"
              : "bg-[#F5F0EA] text-[#9B8979]"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#C97B4A]" />

          Borrowed

          <span className="font-bold">
            {totalBorrowed}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setShowReturned(
              !showReturned,
            )
          }
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            showReturned
              ? "bg-[#EAF0E2] text-[#6B7A4F]"
              : "bg-[#F5F0EA] text-[#9B8979]"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#6B7A4F]" />

          Returned

          <span className="font-bold">
            {totalReturned}
          </span>
        </button>
      </div>
    </div>
  );
}

