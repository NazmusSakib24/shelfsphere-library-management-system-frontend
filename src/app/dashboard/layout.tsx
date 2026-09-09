"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const bypassAuth = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!bypassAuth && !loading && !user) {
        router.push("/login");
        return;
    }

    if (!bypassAuth && !loading && user) {
      const isMemberDashboard = pathname === "/dashboard/member";

      if (user.role === "MEMBER" && !isMemberDashboard) {
        router.push("/dashboard/member");
      } else if (
        (user.role === "ADMIN" || user.role === "LIBRARIAN") &&
        isMemberDashboard
      ) {
        router.push("/dashboard");
      }
    }
    }, [bypassAuth, loading, pathname, user, router]);

  if (loading && !bypassAuth) {
    return <div>Loading...</div>;
  }

  if (!user && !bypassAuth) {
    return null;
  }

  return <>{children}</>;
}
