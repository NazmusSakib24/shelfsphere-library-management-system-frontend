"use client";

import { useEffect, useState } from "react";
import {
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

import {
  getMostBorrowedBooks,
  getOverdueBooks,
  getTopMembers,
  getFinesReport,
  MostBorrowedBook,
  OverdueBook,
  TopMember,
  FinesReport,
} from "@/services/reports";

import ReportStats from "@/components/reports/ReportStats";
import MostBorrowedBooks from "@/components/reports/MostBorrowedBooks";
import TopMembers from "@/components/reports/TopMembers";
import FinancialReport from "@/components/reports/FinancialReport";
import OverdueBooks from "@/components/reports/OverdueBooks";
import ReportLoading from "@/components/reports/ReportLoading";

type ReportTab =
  | "overview"
  | "members"
  | "inventory"
  | "financial";

export default function ReportsPage() {
  const [activeTab, setActiveTab] =
    useState<ReportTab>("overview");

  const [mostBorrowed, setMostBorrowed] =
    useState<MostBorrowedBook[]>([]);

  const [overdueBooks, setOverdueBooks] =
    useState<OverdueBook[]>([]);

  const [topMembers, setTopMembers] =
    useState<TopMember[]>([]);

  const [fines, setFines] =
    useState<FinesReport | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      setError(null);

      const [
        mostBorrowedData,
        overdueData,
        topMembersData,
        finesData,
      ] = await Promise.all([
        getMostBorrowedBooks(),
        getOverdueBooks(),
        getTopMembers(),
        getFinesReport(),
      ]);

      setMostBorrowed(mostBorrowedData);
      setOverdueBooks(overdueData);
      setTopMembers(topMembersData);
      setFines(finesData);
    } catch (err) {
      console.error(
        "Failed to load reports:",
        err
      );

      setError(
        "Unable to load report data."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ReportLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF3E9] p-7">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-[#C96F4A]">
              {error}
            </p>

            <Button
              onClick={loadReports}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * These values are placeholders until the backend
   * provides aggregate analytics endpoints.
   *
   * We should NOT fake them in the final version.
   */
  const circulationRate = 0;
  const newMembers = 0;
  const averageLoanDuration = 0;
  const returnRate = 0;

  return (
    <div className="min-h-screen bg-[#FAF3E9]">

      <div className="flex">

        <DashboardSidebar />

        <div className="min-w-0 flex-1">

          <DashboardHeader />

          <main className="p-7">

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h1 className="text-xl font-semibold text-[#2E211A]">
                  Reports
                </h1>

                <p className="mt-1 text-sm text-[#8C7B6B]">
                  Library performance and analytics
                </p>
              </div>

            </div>

            {/* TABS */}

            <div className="mb-6 flex gap-2">

              <ReportTabButton
                active={
                  activeTab === "overview"
                }
                onClick={() =>
                  setActiveTab("overview")
                }
              >
                Overview
              </ReportTabButton>

              <ReportTabButton
                active={
                  activeTab === "members"
                }
                onClick={() =>
                  setActiveTab("members")
                }
              >
                Members
              </ReportTabButton>

              <ReportTabButton
                active={
                  activeTab === "inventory"
                }
                onClick={() =>
                  setActiveTab("inventory")
                }
              >
                Inventory
              </ReportTabButton>

              <ReportTabButton
                active={
                  activeTab === "financial"
                }
                onClick={() =>
                  setActiveTab("financial")
                }
              >
                Financial
              </ReportTabButton>

            </div>

            {/* OVERVIEW */}

            {activeTab === "overview" && (
              <div className="space-y-6">

                <ReportStats
                  circulationRate={
                    circulationRate
                  }
                  newMembers={newMembers}
                  averageLoanDuration={
                    averageLoanDuration
                  }
                  returnRate={returnRate}
                />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                  <Card className="bg-[#FFFEFC]">

                    <CardHeader>
                      <CardTitle>
                        Most Borrowed Books
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <MostBorrowedBooks
                        books={mostBorrowed}
                      />
                    </CardContent>

                  </Card>

                  <Card className="bg-[#FFFEFC]">

                    <CardHeader>
                      <CardTitle>
                        Top Members
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <TopMembers
                        members={topMembers}
                      />
                    </CardContent>

                  </Card>

                </div>

                <Card className="bg-[#FFFEFC]">

                  <CardHeader>
                    <CardTitle>
                      Overdue Books
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <OverdueBooks
                      books={overdueBooks}
                    />
                  </CardContent>

                </Card>

              </div>
            )}

            {/* MEMBERS */}

            {activeTab === "members" && (
              <div className="space-y-6">

                <Card className="bg-[#FFFEFC]">

                  <CardHeader>
                    <CardTitle>
                      Top Members
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <TopMembers
                      members={topMembers}
                    />
                  </CardContent>

                </Card>

                <Card className="bg-[#FFFEFC]">

                  <CardHeader>
                    <CardTitle>
                      Overdue Books
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <OverdueBooks
                      books={overdueBooks}
                    />
                  </CardContent>

                </Card>

              </div>
            )}

            {/* INVENTORY */}

            {activeTab === "inventory" && (
              <Card className="bg-[#FFFEFC]">

                <CardHeader>
                  <CardTitle>
                    Most Borrowed Books
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <MostBorrowedBooks
                    books={mostBorrowed}
                  />
                </CardContent>

              </Card>
            )}

            {/* FINANCIAL */}

            {activeTab === "financial" && (
              <div className="space-y-6">

                {fines && (
                  <FinancialReport
                    data={fines}
                  />
                )}

              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
}

function ReportTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-lg
        px-4
        py-2
        text-sm
        font-medium
        transition
        ${
          active
            ? "bg-[#C96F4A] text-white"
            : "bg-white text-[#6B5B4D] hover:bg-[#F3EAE0]"
        }
      `}
    >
      {children}
    </button>
  );
}