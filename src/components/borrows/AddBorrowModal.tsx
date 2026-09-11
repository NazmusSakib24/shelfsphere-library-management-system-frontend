
"use client";

import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  CalendarPlus,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

import { User } from "@/services/users";
import type { Book } from "@/types/book";

interface BorrowForm {
  memberId: string;
  bookId: string;
}

interface AddBorrowModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
  loading: boolean;
  saving: boolean;
  form: BorrowForm;
  setForm: Dispatch<SetStateAction<BorrowForm>>;
  members: User[];
  availableBooks: Book[];
}

export default function AddBorrowModal({
  open,
  onClose,
  onSubmit,
  loading,
  saving,
  form,
  setForm,
  members,
  availableBooks,
}: AddBorrowModalProps) {
  const [memberSearch, setMemberSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const [showMemberList, setShowMemberList] = useState(false);
  const [showBookList, setShowBookList] = useState(false);

  const selectedMember = members.find(
    (member) => String(member.id) === form.memberId,
  );

  const selectedBook = availableBooks.find(
    (book) => String(book.id) === form.bookId,
  );

  const filteredMembers = useMemo(() => {
    const keyword = memberSearch.trim().toLowerCase();

    if (!keyword) {
      return members;
    }

    return members.filter(
      (member) =>
        member.fullName?.toLowerCase().includes(keyword) ||
        member.email?.toLowerCase().includes(keyword),
    );
  }, [members, memberSearch]);

  const filteredBooks = useMemo(() => {
    const keyword = bookSearch.trim().toLowerCase();

    if (!keyword) {
      return availableBooks;
    }

    return availableBooks.filter(
      (book) =>
        book.title?.toLowerCase().includes(keyword) ||
        book.author?.toLowerCase().includes(keyword) ||
        book.isbn?.toLowerCase().includes(keyword),
    );
  }, [availableBooks, bookSearch]);

  const selectMember = (member: User) => {
    setForm((previous) => ({
      ...previous,
      memberId: String(member.id),
    }));

    setMemberSearch("");
    setShowMemberList(false);
  };

  const selectBook = (book: Book) => {
    setForm((previous) => ({
      ...previous,
      bookId: String(book.id),
    }));

    setBookSearch("");
    setShowBookList(false);
  };

  const clearMember = () => {
    setForm((previous) => ({
      ...previous,
      memberId: "",
    }));

    setMemberSearch("");
  };

  const clearBook = () => {
    setForm((previous) => ({
      ...previous,
      bookId: "",
    }));

    setBookSearch("");
  };

  const handleClose = () => {
    if (saving) return;

    setMemberSearch("");
    setBookSearch("");
    setShowMemberList(false);
    setShowBookList(false);

    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#EFE5D8] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#4A362A]">
              Issue Book
            </h2>

            <p className="mt-1 text-sm text-[#7A6A5B]">
              Assign an available book to a member with a due date.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg p-2 text-[#806F61] transition hover:bg-[#F1E7DA] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >
          {loading ? (
            <div className="rounded-xl border border-[#E8DCC8] bg-[#FAF3E9] p-8 text-center">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#C97B4A]/30 border-t-[#C97B4A]" />

              <p className="mt-3 text-sm text-[#7A6A5B]">
                Loading members and books...
              </p>
            </div>
          ) : (
            <>
              {/* MEMBER + DATE */}
              <div className="grid gap-5 sm:grid-cols-2">

                {/* MEMBER */}
                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                    Borrower Member
                  </label>

                  {!selectedMember ? (
                    <>
                      {/* SELECT MEMBER BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowMemberList((previous) => !previous);
                          setShowBookList(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl border border-[#D8C9B8] bg-[#FAF3E9] px-4 py-3 text-left text-sm text-[#7A6A5B] outline-none transition hover:border-[#C97B4A] focus:border-[#C97B4A]"
                      >
                        <span>
                          {memberSearch
                            ? memberSearch
                            : "Select member"}
                        </span>

                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            showMemberList
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {/* MEMBER DROPDOWN */}
                      {showMemberList && (
                        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-[#E8DCC8] bg-[#FFFDF9] shadow-xl">

                          {/* SEARCH */}
                          <div className="border-b border-[#EFE5D8] bg-[#FFFDF9] p-3">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8979]" />

                              <input
                                autoFocus
                                type="text"
                                value={memberSearch}
                                onChange={(event) =>
                                  setMemberSearch(
                                    event.target.value,
                                  )
                                }
                                placeholder="Search member..."
                                className="w-full rounded-lg border border-[#D8C9B8] bg-[#FAF3E9] py-2.5 pl-9 pr-3 text-sm text-[#4A362A] outline-none placeholder:text-[#A89787] focus:border-[#C97B4A]"
                              />
                            </div>
                          </div>

                          {/* SCROLLABLE RESULTS */}
                          <div className="max-h-56 overflow-y-auto p-1">
                            {filteredMembers.length === 0 ? (
                              <div className="px-4 py-5 text-center text-sm text-[#8C7B6B]">
                                No members found.
                              </div>
                            ) : (
                              filteredMembers.map((member) => (
                                <button
                                  key={member.id}
                                  type="button"
                                  onClick={() =>
                                    selectMember(member)
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#F5EBDD]"
                                >
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3E0D5] text-sm font-bold text-[#C97B4A]">
                                    {member.fullName
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-[#4A362A]">
                                      {member.fullName}
                                    </p>

                                    <p className="truncate text-xs text-[#7A6A5B]">
                                      {member.email}
                                    </p>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* SELECTED MEMBER */
                    <div className="flex items-center justify-between rounded-xl border border-[#C97B4A] bg-[#FDF3EA] px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#4A362A]">
                          {selectedMember.fullName}
                        </p>

                        <p className="truncate text-xs text-[#7A6A5B]">
                          {selectedMember.email}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={clearMember}
                        className="ml-2 rounded-lg p-1 text-[#9B8979] hover:bg-[#F1E7DA]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* BOOK */}
              <div className="relative">
                <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                  Book
                </label>

                {!selectedBook ? (
                  <>
                    {/* SELECT BOOK BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookList((previous) => !previous);
                        setShowMemberList(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-[#D8C9B8] bg-[#FAF3E9] px-4 py-3 text-left text-sm text-[#7A6A5B] outline-none transition hover:border-[#C97B4A] focus:border-[#C97B4A]"
                    >
                      <span>
                        {bookSearch
                          ? bookSearch
                          : "Select available book"}
                      </span>

                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showBookList
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {/* BOOK DROPDOWN */}
                    {showBookList && (
                      <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-[#E8DCC8] bg-[#FFFDF9] shadow-xl">

                        {/* SEARCH */}
                        <div className="border-b border-[#EFE5D8] bg-[#FFFDF9] p-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8979]" />

                            <input
                              autoFocus
                              type="text"
                              value={bookSearch}
                              onChange={(event) =>
                                setBookSearch(
                                  event.target.value,
                                )
                              }
                              placeholder="Search book title, author or ISBN..."
                              className="w-full rounded-lg border border-[#D8C9B8] bg-[#FAF3E9] py-2.5 pl-9 pr-3 text-sm text-[#4A362A] outline-none placeholder:text-[#A89787] focus:border-[#C97B4A]"
                            />
                          </div>
                        </div>

                        {/* SCROLLABLE BOOK RESULTS */}
                        <div className="max-h-60 overflow-y-auto p-1">
                          {filteredBooks.length === 0 ? (
                            <div className="px-4 py-5 text-center text-sm text-[#8C7B6B]">
                              No available books found.
                            </div>
                          ) : (
                            filteredBooks.map((book) => (
                              <button
                                key={book.id}
                                type="button"
                                onClick={() =>
                                  selectBook(book)
                                }
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#F5EBDD]"
                              >
                                {book.imageUrl ? (
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${book.imageUrl}`}
                                    alt={book.title}
                                    className="h-12 w-9 shrink-0 rounded object-cover"
                                  />
                                ) : (
                                  <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded bg-[#F1E7DA]">
                                    <BookOpen className="h-4 w-4 text-[#A08E7F]" />
                                  </div>
                                )}

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-[#4A362A]">
                                    {book.title}
                                  </p>

                                  <p className="truncate text-xs text-[#7A6A5B]">
                                    {book.author}
                                  </p>

                                  <p className="mt-1 text-[11px] font-semibold text-[#6B7A4F]">
                                    {book.availableCopies} available
                                  </p>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* SELECTED BOOK */
                  <div className="flex items-center gap-4 rounded-xl border border-[#C97B4A] bg-[#FDF3EA] p-4">
                    {selectedBook.imageUrl ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${selectedBook.imageUrl}`}
                        alt={selectedBook.title}
                        className="h-20 w-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-[#F1E7DA]">
                        <BookOpen className="h-6 w-6 text-[#A08E7F]" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#4A362A]">
                        {selectedBook.title}
                      </p>

                      <p className="mt-1 text-sm text-[#7A6A5B]">
                        {selectedBook.author}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#6B7A4F]">
                        {selectedBook.availableCopies} of{" "}
                        {selectedBook.totalCopies} copies available
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearBook}
                      className="rounded-lg p-2 text-[#9B8979] hover:bg-[#F1E7DA]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* NO BOOKS */}
              {availableBooks.length === 0 && (
                <div className="rounded-xl border border-[#E7B9B2] bg-[#FCE8E5] px-4 py-3 text-sm font-medium text-[#B23B2E]">
                  No books are currently available for borrowing.
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 border-t border-[#EFE5D8] pt-5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="rounded-xl border border-[#D8C9B8] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B594C] transition hover:bg-[#F1E7DA] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !form.memberId ||
                    !form.bookId ||
                    availableBooks.length === 0
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C97B4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B96C3D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Issuing...
                    </>
                  ) : (
                    <>
                      <CalendarPlus className="h-4 w-4" />
                      Issue Book
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

