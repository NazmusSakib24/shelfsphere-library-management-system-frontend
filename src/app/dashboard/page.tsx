"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  FiBook,
  FiUsers,
  FiRepeat,
  FiDollarSign,
} from "react-icons/fi";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import BorrowingActivity from "@/components/dashboard/BorrowingActivity";
import TopCategories from "@/components/dashboard/TopCategories";
import RecentActivity from "@/components/dashboard/RecentActivity";

import {
  getDashboardStats,
  DashboardStats,
} from "@/services/dashboard";

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardStats();

        console.log("Dashboard data:", data);

        setStats(data);
      } catch (error: unknown) {
        console.error(
          "Dashboard API error:",
          error
        );

        if (isAxiosError(error) && error.response?.status === 401) {
          setError(
            "You are not authenticated. Please login."
          );
        } else if (isAxiosError(error) && error.response?.status === 403) {
          setError(
            "You do not have permission to view the dashboard."
          );
        } else {
          setError(
            "Failed to load dashboard data."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF3E9]">
      <DashboardSidebar />

      <DashboardHeader />

      <main className="ml-[264px] pt-[72px]">
        <div className="p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2E211A]">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#8C7B6B]">
              Library management overview
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Books"
              value={
                loading
                  ? "Loading..."
                  : stats?.totalBooks ?? 0
              }
              subtitle="Books in library"
              icon={FiBook}
            />

            <StatCard
              title="Active Members"
              value={
                loading
                  ? "Loading..."
                  : stats?.totalUsers ?? 0
              }
              subtitle="Registered users"
              icon={FiUsers}
              iconColor="#6B7A4F"
            />

            <StatCard
              title="Books Borrowed"
              value={
                loading
                  ? "Loading..."
                  : stats?.borrowedBooks ?? 0
              }
              subtitle="Currently borrowed"
              icon={FiRepeat}
              iconColor="#B08828"
            />

            <StatCard
              title="Pending Fines"
              value={
                loading
                  ? "Loading..."
                  : stats?.unpaidFines ?? 0
              }
              subtitle="Unpaid fines"
              icon={FiDollarSign}
              iconColor="#B23B2E"
            />

          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-6 xl:grid-cols-3">

            <div className="xl:col-span-2">
              <BorrowingActivity
                data={stats?.activity ?? []}
              />
            </div>

            <div>
              <TopCategories
                categories={stats?.categories ?? []}
              />
            </div>

          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <RecentActivity
              activities={
                stats?.recentActivity ?? []
              }
            />
          </div>

        </div>
      </main>
    </div>
  );
}
