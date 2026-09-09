"use client";

import Link from "next/link";
import { BookOpen, LayoutDashboard, Users, Repeat2, ShieldCheck, FolderTree, CircleDollarSign, BarChart3, LogOut } from "lucide-react";

const navigation = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Books", "/dashboard/books", BookOpen],
  ["Users", "/dashboard/users", Users],
  ["Borrows", "/dashboard/borrows", Repeat2],
  ["Reservations", "/dashboard/reservations", ShieldCheck],
  ["Categories", "/dashboard/categories", FolderTree],
  ["Fines", "/dashboard/fines", CircleDollarSign],
  ["Reports", "/dashboard/reports", BarChart3],
] as const;

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[264px] flex-col border-r border-[#E8DCC8] bg-[#FFF9F2] px-4 py-6">
      <Link href="/" className="mb-8 flex items-center gap-3 px-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-[#C97B4A] text-white"><BookOpen className="size-5" /></span>
        <span><strong className="block text-lg text-[#2E211A]">ShelfSphere</strong><span className="text-[10px] uppercase tracking-[0.18em] text-[#81927C]">Library system</span></span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map(([label, href, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#6B5B4D] hover:bg-[#F3EAE0] hover:text-[#2E211A]"><Icon className="size-[18px]" />{label}</Link>)}
      </nav>
      <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#8C7B6B] hover:bg-[#F3EAE0]"><LogOut className="size-[18px]" />Sign out</Link>
    </aside>
  );
}
