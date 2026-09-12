
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


  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && user) {
      const isMemberDashboard =
        pathname.startsWith("/dashboard/member");
      
      if(user.role === "LIBRARIAN" && pathname === "/dashboard/users"){
        router.push("/dashboard");
      }

      else if (user.role === "MEMBER" && !isMemberDashboard
      ) {
        router.push("/dashboard/member");
      } 
      else if ((user.role === "ADMIN" || user.role === "LIBRARIAN") && isMemberDashboard
      ) {
        router.push("/dashboard");
      }
    }
  }, [
    
    loading,
    pathname,
    user,
    router,
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if(user.role === "LIBRARIAN" && pathname === "/dashboard/users"){
    return null;
  }

  
  if (pathname.startsWith("/dashboard/member")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF3E9]">
  
      <DashboardSidebar />

      {pathname !== "/dashboard/users" && <DashboardHeader />}

      <main className={`ml-[264px] min-h-screen ${pathname !== "/dashboard/users" ? "pt-[72px]" : ""}`}>
        {children}
      </main>
    </div>
  );
}

