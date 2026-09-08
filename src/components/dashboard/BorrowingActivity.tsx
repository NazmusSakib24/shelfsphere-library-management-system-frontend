"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import type { DashboardActivity } from "@/services/dashboard";

interface BorrowingActivityProps {
  data: DashboardActivity[];
}

export default function BorrowingActivity({
  data,
}: BorrowingActivityProps) {
  return (
    <div className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#2E211A]">
          Borrowing Activity
        </h3>

        <p className="mt-1 text-sm text-[#8C7B6B]">
          Borrowed and returned books
        </p>
      </div>

      <div className="h-[300px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#8C7B6B]">
            No borrowing activity yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="100%"
                    stopColor="#C97B4A"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#EFE5D8"
              />

              <XAxis
                dataKey="week"
                tick={{
                  fill: "#8C7B6B",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#8C7B6B",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="borrows"
                stroke="#C97B4A"
                fill="url(#borrowGradient)"
                strokeWidth={3}
              />

              <Area
                type="monotone"
                dataKey="returned"
                stroke="#6B7A4F"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C97B4A]" />
          <span className="text-[#6B5B4D]">
            Borrowed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#6B7A4F]" />
          <span className="text-[#6B5B4D]">
            Returned
          </span>
        </div>
      </div>
    </div>
  );
}