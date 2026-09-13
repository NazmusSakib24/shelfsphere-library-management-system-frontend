"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarClock,
  Library,
  ArrowRight,
} from "lucide-react";

interface WelcomeHeroProps {
  userName: string;
  borrowedBooks?: number;
  dueSoonBooks?: number;
}

export default function WelcomeHero({
  userName,
  borrowedBooks = 0,
  dueSoonBooks = 0,
}: WelcomeHeroProps) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#EFE5D8] bg-[#FFFDF9]">
      {/* Decorative background */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#F6E7D8] opacity-70" />

      <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[#F1D8C4] opacity-40" />

      {/* Decorative books */}
      <div className="pointer-events-none absolute right-8 top-8 hidden text-[#C97B4A] opacity-20 md:block">
        <BookOpen size={120} strokeWidth={1} />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Small label */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F5E9DE] px-3 py-1.5 text-xs font-semibold text-[#9A5A35]">
              <Library size={14} />
              ShelfSphere Library
            </div>

            {/* Greeting */}
            <h1 className="text-3xl font-bold tracking-tight text-[#2E211A] sm:text-4xl">
              Welcome back,{" "}
              <span className="text-[#C97B4A]">{userName}</span>!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#8C7B6B] sm:text-base">
              Ready to discover your next great read? Keep exploring the
              library and continue your reading journey with ShelfSphere.
            </p>

            {/* Quick Statistics */}
            <div className="mt-6 flex flex-wrap gap-3">
              {/* Borrowed */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#EFE5D8] bg-white/80 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E9DE] text-[#C97B4A]">
                  <BookOpen size={19} />
                </div>

                <div>
                  <p className="text-lg font-bold text-[#2E211A]">
                    {borrowedBooks}
                  </p>

                  <p className="text-xs text-[#8C7B6B]">
                    Borrowed books
                  </p>
                </div>
              </div>

              {/* Due Soon */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#EFE5D8] bg-white/80 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E9DE] text-[#C97B4A]">
                  <CalendarClock size={19} />
                </div>

                <div>
                  <p className="text-lg font-bold text-[#2E211A]">
                    {dueSoonBooks}
                  </p>

                  <p className="text-xs text-[#8C7B6B]">
                    Due soon
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-6">
              <Link
                href="/dashboard/member/books"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C97B4A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B96B3C] hover:shadow-md"
              >
                Explore Library
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden min-w-[240px] lg:block">
            <div className="relative mx-auto h-52 w-52">
              {/* Back book */}
              <div className="absolute right-5 top-8 h-36 w-24 rotate-[12deg] rounded-lg border border-[#D8B89F] bg-[#E7C6AD] shadow-md">
                <div className="absolute left-2 top-5 h-1 w-16 rounded bg-[#C97B4A] opacity-40" />
                <div className="absolute left-2 top-9 h-1 w-12 rounded bg-[#C97B4A] opacity-30" />
              </div>

              {/* Middle book */}
              <div className="absolute right-16 top-14 h-40 w-28 -rotate-[7deg] rounded-lg border border-[#D8B89F] bg-[#F0D9C5] shadow-lg">
                <div className="absolute left-3 top-6 h-1 w-20 rounded bg-[#C97B4A] opacity-40" />
                <div className="absolute left-3 top-10 h-1 w-14 rounded bg-[#C97B4A] opacity-30" />
              </div>

              {/* Front book */}
              <div className="absolute bottom-5 left-5 h-32 w-24 rotate-[4deg] rounded-lg border border-[#D8B89F] bg-[#C97B4A] shadow-xl">
                <div className="absolute inset-x-3 top-6 border-b border-white/30 pb-3 text-center">
                  <BookOpen
                    size={25}
                    className="mx-auto text-white/90"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="absolute bottom-5 left-3 right-3 h-1 rounded bg-white/30" />
                <div className="absolute bottom-2 left-7 right-7 h-1 rounded bg-white/20" />
              </div>

              {/* Floating circle */}
              <div className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                <BookOpen
                  size={21}
                  className="text-[#C97B4A]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}