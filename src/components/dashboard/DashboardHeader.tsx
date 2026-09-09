
"use client";

import { useState } from "react";
import {
  FiBell,
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-[264px] right-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#E8DCC8] bg-[#FFF9F2] px-8">
      
      {/* Search */}
      <div className="flex w-[420px] items-center gap-3 rounded-full bg-[#F3EAE0] px-5 py-3">
        <FiSearch className="text-[#8C7B6B]" />

        <input
          type="text"
          placeholder="Search books, users, transactions..."
          className="w-full bg-transparent text-sm text-[#2E211A] outline-none placeholder:text-[#8C7B6B]"
        />
      </div>

      <div className="flex items-center gap-5">

        {/* Quick Add */}
        <button className="flex items-center gap-2 rounded-xl bg-[#C97B4A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B86C3E]">
          <FiPlus />
          Quick Add
        </button>

        {/* Notification */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#6B5B4D] hover:bg-[#F3EAE0]">
          <FiBell className="text-xl" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#B23B2E]" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C97B4A] text-sm font-bold text-white">
              A
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-[#2E211A]">
                Admin
              </p>

              <p className="text-xs text-[#8C7B6B]">
                Administrator
              </p>
            </div>

            <FiChevronDown className="text-[#8C7B6B]" />
          </button>

          {open && (
            <div className="absolute right-0 top-14 w-48 rounded-xl border border-[#E8DCC8] bg-white p-2 shadow-lg">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#6B5B4D] hover:bg-[#F3EAE0]">
                <FiUser />
                Profile
              </button>

              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#B23B2E] hover:bg-[#FDECEA]">
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

