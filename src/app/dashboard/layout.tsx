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

  useEffect(() => {
    if (!loading && !user) {
        router.push("/login");
        return;
    }

    if (
        !loading &&
        user &&
        user.role !== "ADMIN" &&
        user.role !== "LIBRARIAN"
    ) {
        router.push("/member");
    }
    }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}