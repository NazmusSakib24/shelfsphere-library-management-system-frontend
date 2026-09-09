"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const bypassAuth = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!bypassAuth && !loading && !user) {
        router.push("/login");
        return;
    }

    if (
        !bypassAuth &&
        !loading &&
        user &&
        user.role !== "ADMIN" &&
        user.role !== "LIBRARIAN"
    ) {
        router.push("/member");
    }
    }, [bypassAuth, loading, user, router]);

  if (loading && !bypassAuth) {
    return <div>Loading...</div>;
  }

  if (!user && !bypassAuth) {
    return null;
  }

  return <>{children}</>;
}