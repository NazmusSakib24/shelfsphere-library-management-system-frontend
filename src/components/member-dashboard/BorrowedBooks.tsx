"use client";

import {
  FaBookOpen,
  FaCalendarAlt,
} from "react-icons/fa";

import { MemberBorrow } from "@/services/member-dashboard";

interface BorrowedBooksProps {
  books: MemberBorrow[];
}

export default function BorrowedBooks({
  books,
}: BorrowedBooksProps) {
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <section
      id="borrowed"
      className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[#EFE5D8] p-6">
        <div>
          <h2 className="text-lg font-bold text-[#4A362A]">
            Currently Borrowed
          </h2>

          <p className="mt-1 text-sm text-[#8A7567]">
            Books currently in your possession
          </p>
        </div>

        <FaBookOpen
          className="text-[#C97B4A]"
          size={20}
        />
      </div>

      {books.length === 0 ? (
        <div className="p-10 text-center">
          <FaBookOpen
            className="mx-auto mb-3 text-[#CDBEAF]"
            size={32}
          />

          <p className="font-medium text-[#6D594C]">
            No books currently borrowed
          </p>

          <p className="mt-1 text-sm text-[#9B8778]">
            Your borrowed books will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#EFE5D8]">
          {books.map((borrow) => {
            const overdue =
              isOverdue(borrow.dueDate);

            return (
              <div
                key={borrow.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-[#FCF6EF] md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E0D5]">
                    <FaBookOpen
                      className="text-[#C97B4A]"
                      size={17}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#4A362A]">
                      {borrow.book.title}
                    </h3>

                    {borrow.book.author && (
                      <p className="mt-1 text-sm text-[#8A7567]">
                        {borrow.book.author}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-[#806B5D]">
                      <FaCalendarAlt size={13} />
                      Due date
                    </div>

                    <p
                      className={`mt-1 font-medium ${
                        overdue
                          ? "text-[#B23B2E]"
                          : "text-[#4A362A]"
                      }`}
                    >
                      {new Date(
                        borrow.dueDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      overdue
                        ? "bg-[#F6DEDA] text-[#B23B2E]"
                        : "bg-[#E5EBD9] text-[#59683E]"
                    }`}
                  >
                    {overdue
                      ? "Overdue"
                      : "Borrowed"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}