"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaBook,
  FaBookOpen,
  FaBookmark,
  FaMoneyBillWave,
  FaHistory,
  FaHome,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import BooksPage from "@/app/dashboard/books/page";

export default function MemberBooksPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAF3E9] text-[#4A362A]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[#E8DCC8] bg-[#F1E7DA] lg:block">
        <div className="flex h-full flex-col">
          <Link
            href="/dashboard/member"
            className="flex h-[72px] items-center gap-3 border-b border-[#E8DCC8] px-6"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C97B4A] text-white">
              <FaBook size={17} />
            </span>
            <span>
              <strong className="block text-[#4A362A]">ShelfSphere</strong>
              <span className="text-[10px] uppercase tracking-wider text-[#8A7567]">Member Portal</span>
            </span>
          </Link>

          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9B8778]">My Library</p>
            <Link href="/dashboard/member" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]">
              <FaHome size={15} /> Dashboard
            </Link>
            <Link href="/dashboard/member/books" className="flex items-center gap-3 rounded-xl bg-[#F3E0D5] px-4 py-3 text-sm font-semibold text-[#C06D3D]">
              <FaBookOpen size={15} /> Books
            </Link>
            <Link href="/dashboard/member#borrowed" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]">
              <FaBookOpen size={15} /> My Borrowed Books
            </Link>
            <Link href="/dashboard/member#reservations" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]">
              <FaBookmark size={15} /> My Reservations
            </Link>
            <Link href="/dashboard/member#fines" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]">
              <FaMoneyBillWave size={15} /> My Fines
            </Link>
            <Link href="/dashboard/member#activity" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]">
              <FaHistory size={15} /> Activity
            </Link>

            <div className="my-5 border-t border-[#E8DCC8]" />

            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9B8778]">Account</p>
            <Link href="/dashboard/member#profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]">
              <FaUser size={15} /> My Profile
            </Link>
          </nav>

          <div className="border-t border-[#E8DCC8] p-4">
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#8A5B50] transition hover:bg-[#E9DDCE]">
              <FaSignOutAlt size={15} /> Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-[#E8DCC8] bg-[#FFF9F2]/95 px-4 backdrop-blur md:px-8">
          <div>
            <h1 className="text-lg font-bold">Books</h1>
            <p className="text-xs text-[#8A7567]">Browse the library catalogue</p>
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
              <FaUser className="text-[#C97B4A]" size={16} />
            </div>
          </div>
        </header>
        <BooksPage memberView />
      </div>
    </div>
  );
}
