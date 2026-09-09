
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiBook,
  FiUsers,
  FiRepeat,
  FiClock,
  FiTag,
  FiDollarSign,
  FiBarChart2,
  FiBookOpen,
} from "react-icons/fi";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: FiGrid,
  },
  {
    name: "Books",
    href: "/dashboard/books",
    icon: FiBook,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: FiUsers,
  },
  {
    name: "Borrows",
    href: "/dashboard/borrows",
    icon: FiRepeat,
  },
  {
    name: "Reservations",
    href: "/dashboard/reservations",
    icon: FiClock,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: FiTag,
  },
  {
    name: "Fines",
    href: "/dashboard/fines",
    icon: FiDollarSign,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FiBarChart2,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[264px] flex-col border-r border-[#E8DCC8] bg-[#F1E7DA] text-[#4A362A]">

      {/* Logo */}
      <div className="flex h-[72px] items-center gap-3 border-b border-[#E8DCC8] px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E0D5]">
          <FiBookOpen className="text-xl text-[#C97B4A]" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-[#2E211A]">
            ShelfSphere
          </h1>

          <p className="text-xs text-[#8C7B6B]">
            Library Management
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#8C7B6B]">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#C97B4A] text-white shadow-sm"
                  : "text-[#6B5B4D] hover:bg-[#E8DCC8]"
              }`}
            >
              <Icon className="text-lg" />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom information */}
      <div className="border-t border-[#E8DCC8] p-4">
        <div className="rounded-xl bg-[#FFF9F2] p-4">
          <p className="text-xs font-semibold text-[#8C7B6B]">
            ShelfSphere
          </p>

          <p className="mt-1 text-sm font-medium text-[#2E211A]">
            Library System
          </p>

          <p className="mt-1 text-xs text-[#8C7B6B]">
            v1.0.0
          </p>
        </div>
      </div>

    </aside>
  );
}

