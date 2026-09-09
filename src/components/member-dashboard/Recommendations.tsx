"use client";

import {
  FaBook,
  FaArrowRight,
} from "react-icons/fa";

import { MemberBook } from "@/services/member-dashboard";

interface RecommendationsProps {
  books: MemberBook[];
}

export default function Recommendations({
  books,
}: RecommendationsProps) {
  return (
    <section className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#4A362A]">
            Recommended Books
          </h2>

          <p className="mt-1 text-sm text-[#8A7567]">
            Books you may want to explore
          </p>
        </div>

        <FaArrowRight
          className="text-[#C97B4A]"
          size={16}
        />
      </div>

      {books.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-[#8A7567]">
            No recommendations available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {books.map((book) => (
            <div
              key={book.id}
              className="group rounded-xl border border-[#EFE5D8] bg-[#FCF7F0] p-4 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-28 items-center justify-center rounded-lg bg-[#F1E7DA]">
                <FaBook
                  className="text-[#C97B4A]"
                  size={30}
                />
              </div>

              <h3 className="line-clamp-2 text-sm font-semibold text-[#4A362A]">
                {book.title}
              </h3>

              {book.author && (
                <p className="mt-1 truncate text-xs text-[#8A7567]">
                  {book.author}
                </p>
              )}

              {book.categories &&
                book.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {book.categories
                      .slice(0, 2)
                      .map((category) => (
                        <span
                          key={
                            category.id ??
                            category.name
                          }
                          className="rounded-full bg-[#F3E0D5] px-2 py-1 text-[10px] font-medium text-[#8A5B40]"
                        >
                          {category.name}
                        </span>
                      ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}