
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading } = useAuth();

  const bypassAuth =
    process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!bypassAuth && !loading && !user) {
      router.push("/login");
      return;
    }

    if (!bypassAuth && !loading && user) {
      const isMemberDashboard =
        pathname === "/dashboard/member";

      if (
        user.role === "MEMBER" &&
        !isMemberDashboard
      ) {
        router.push("/dashboard/member");
      } else if (
        (user.role === "ADMIN" ||
          user.role === "LIBRARIAN") &&
        isMemberDashboard
      ) {
        router.push("/dashboard");
      }
    }
  }, [
    bypassAuth,
    loading,
    pathname,
    user,
    router,
  ]);

  if (loading && !bypassAuth) {
    return <div>Loading...</div>;
  }

  if (!user && !bypassAuth) {
    return null;
  }

  // The member dashboard owns its responsive sidebar and header.
  if (pathname === "/dashboard/member") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF3E9]">
      {/* Sidebar */}
      <DashboardSidebar />

      <DashboardHeader />

      {/* Main Content */}
      <main className="ml-[264px] min-h-screen pt-[72px]">
        {children}
      </main>
    </div>
  );
}

