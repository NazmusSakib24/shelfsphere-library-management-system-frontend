"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaBook,
  FaBookOpen,
  FaBookmark,
  FaMoneyBillWave,
  FaHistory,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import MemberStats from "@/components/member-dashboard/MemberStats";
import BorrowedBooks from "@/components/member-dashboard/BorrowedBooks";
import Reservations from "@/components/member-dashboard/Reservations";
import ActivityFeed from "@/components/member-dashboard/ActivityFeed";

import {
  getMemberDashboard,
  MemberDashboard,
} from "@/services/member-dashboard";

export default function MemberDashboardPage() {
  const router = useRouter();
  const [data, setData] =
    useState<MemberDashboard | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const result =
          await getMemberDashboard();

        setData(result);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load your dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF3E9]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8DCC8] border-t-[#C97B4A]" />

          <p className="mt-4 text-sm text-[#806B5D]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF3E9] p-6">
        <div className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-8 text-center shadow-sm">
          <p className="font-semibold text-[#B23B2E]">
            {error || "Something went wrong."}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-[#C97B4A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#B8693D]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E9] text-[#4A362A]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[#E8DCC8] bg-[#F1E7DA] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-[72px] items-center justify-between border-b border-[#E8DCC8] px-6">
            <Link
              href="/dashboard/member"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C97B4A] text-white">
                <FaBook size={17} />
              </div>

              <div>
                <h1 className="font-bold text-[#4A362A]">
                  ShelfSphere
                </h1>

                <p className="text-[10px] uppercase tracking-wider text-[#8A7567]">
                  Member Portal
                </p>
              </div>
            </Link>

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="text-[#6D594C] lg:hidden"
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9B8778]">
              My Library
            </p>

            <Link
              href="/dashboard/member"
              className="flex items-center gap-3 rounded-xl bg-[#F3E0D5] px-4 py-3 text-sm font-semibold text-[#C06D3D]"
            >
              <FaHome size={15} />
              Dashboard
            </Link>

            <Link
              href="/dashboard/member/books"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]"
            >
              <FaBook size={15} />
              Books
            </Link>

            <Link
              href="#borrowed"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]"
            >
              <FaBookOpen size={15} />
              My Borrowed Books
            </Link>

            <Link
              href="#reservations"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]"
            >
              <FaBookmark size={15} />
              My Reservations
            </Link>

            <Link
              href="#fines"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]"
            >
              <FaMoneyBillWave size={15} />
              My Fines
            </Link>

            <Link
              href="#activity"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]"
            >
              <FaHistory size={15} />
              Activity
            </Link>

            <div className="my-5 border-t border-[#E8DCC8]" />

            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9B8778]">
              Account
            </p>

            <Link
              href="#profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]"
            >
              <FaUser size={15} />
              My Profile
            </Link>
          </nav>

          {/* Logout */}
          <div className="border-t border-[#E8DCC8] p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#8A5B50] transition hover:bg-[#E9DDCE]"
            >
              <FaSignOutAlt size={15} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#E8DCC8] bg-[#FFF9F2]/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-lg p-2 text-[#6D594C] hover:bg-[#F1E7DA] lg:hidden"
            >
              <FaBars />
            </button>

            <div>
              <h2 className="text-lg font-bold text-[#4A362A]">
                My Library
              </h2>

              <p className="hidden text-xs text-[#8A7567] sm:block">
                Manage your books and library activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#4A362A]">
                Member
              </p>

              <p className="text-xs text-[#9B8778]">
                Library Account
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E0D5]">
              <FaUser
                className="text-[#C97B4A]"
                size={16}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <div className="rounded-2xl border border-[#E8DCC8] bg-[#F1E7DA] p-6 md:p-8">
              <p className="text-sm font-medium text-[#8A7567]">
                Welcome back 👋
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#4A362A] md:text-3xl">
                Your personal library dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806B5D]">
                Keep track of your borrowed books,
                reservations, fines, reading history,
                and discover something new to read.
              </p>
            </div>
          </div>

          {/* Stats */}
          <MemberStats
            borrowedBooks={data.borrowedBooks}
            reservedBooks={data.reservedBooks}
            pendingFines={data.pendingFines}
            totalFineAmount={data.totalFineAmount}
            booksRead={data.booksRead}
          />

          {/* Borrowed + Reservations */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <BorrowedBooks
              books={data.currentBorrows}
            />

            <Reservations
              reservations={data.reservations}
            />
          </div>

          {/* Activity + Fines */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ActivityFeed
              activities={data.recentActivity}
            />

            <section
              id="fines"
              className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] shadow-sm"
            >
              <div className="border-b border-[#EFE5D8] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#4A362A]">
                      My Fines
                    </h2>

                    <p className="mt-1 text-sm text-[#8A7567]">
                      Outstanding fines on your account
                    </p>
                  </div>

                  <FaMoneyBillWave
                    className="text-[#B08828]"
                    size={20}
                  />
                </div>
              </div>

              {data.fines.length === 0 ? (
                <div className="p-10 text-center">
                  <FaMoneyBillWave
                    className="mx-auto mb-3 text-[#CDBEAF]"
                    size={30}
                  />

                  <p className="font-medium text-[#59683E]">
                    No pending fines
                  </p>

                  <p className="mt-1 text-sm text-[#9B8778]">
                    Your account is clear.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#EFE5D8]">
                  {data.fines.map((fine) => (
                    <div
                      key={fine.id}
                      className="flex items-center justify-between p-5"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#4A362A]">
                          Fine #{fine.id}
                        </p>

                        <p className="mt-1 text-xs text-[#9B8778]">
                          {new Date(
                            fine.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="font-bold text-[#B23B2E]">
                        {Number(
                          fine.amount,
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Profile placeholder */}
          <section
            id="profile"
            className="mt-6 rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E0D5]">
                <FaUser
                  className="text-[#C97B4A]"
                  size={18}
                />
              </div>

              <div>
                <h2 className="font-bold text-[#4A362A]">
                  My Profile
                </h2>

                <p className="mt-1 text-sm text-[#8A7567]">
                  Your profile information can be
                  managed from the account section.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
