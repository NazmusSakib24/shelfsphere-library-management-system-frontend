"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  FaBook,
  FaBookOpen,
  FaBookmark,
  FaMoneyBillWave,
  FaHistory,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaTimes,
} from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";
import { getBooks } from "@/services/books";
import { createReservation } from "@/services/reservations";
import type { Book } from "@/types/book";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function MemberBooksCatalogue() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [reserving, setReserving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getBooks({ limit: 100 })
      .then((result) => setBooks(result.data))
      .catch(() => setMessage("Unable to load the book catalogue."))
      .finally(() => setLoading(false));
  }, []);

  const openDetails = (book: Book) => {
    setMessage("");
    setSelectedBook(book);
  };

  const reserveBook = async () => {
    if (!selectedBook || !user) return;

    try {
      setReserving(true);
      setMessage("");
      await createReservation(user.id, selectedBook.id);
      setMessage("Reservation request submitted successfully.");
    } catch (error) {
      const apiMessage =
        isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined;

      setMessage(
        apiMessage ||
          "Unable to submit the reservation request. Please try again.",
      );
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-sm text-[#8A7567]">Loading books...</div>;
  }

  return (
    <main className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-[#4A362A]">Browse Books</h2>
        <p className="mt-1 text-sm text-[#8A7567]">Select a book to view its information and reserve it.</p>

        {message && !selectedBook && <p className="mt-5 rounded-xl bg-[#FCE8E4] p-4 text-sm text-[#B94A38]">{message}</p>}

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => openDetails(book)}
              className="group w-full max-w-[240px] justify-self-center overflow-hidden rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C97B4A] focus:ring-offset-2"
            >
              <div className="book-display relative aspect-[2/3] bg-[#F1E7DA]">
                <div className="book-3d">
                  {book.imageUrl ? <img src={`${API_URL}${book.imageUrl}`} alt={book.title} className="h-full w-full object-cover transition group-hover:scale-[1.03]" /> : <div className="book-cover-fallback flex h-full w-full items-center justify-center"><FaBookOpen className="text-[#CDBEAF]" size={48} /></div>}
                  <span className="book-cover-highlight" aria-hidden="true" />
                </div>
                <span className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold ${book.availableCopies > 0 ? "bg-[#E9EFE2] text-[#687A4A]" : "bg-[#FCE8E4] text-[#B94A38]"}`}>{book.availableCopies > 0 ? "Available" : "Unavailable"}</span>
              </div>
              <div className="p-5">
                <h3 className="line-clamp-2 font-bold text-[#2E211A]">{book.title}</h3>
                <p className="mt-1 text-sm text-[#8A7567]">{book.author}</p>
                <p className="mt-3 text-xs text-[#9B8778]">{book.categories?.map((category) => category.name).join(", ") || "Uncategorized"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !reserving) setSelectedBook(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="book-information-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#FFFDF9] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFE5D8] px-6 py-5">
              <div><h2 id="book-information-title" className="text-xl font-bold text-[#2E211A]">Book Information</h2><p className="mt-1 text-sm text-[#8A7567]">Review before reserving.</p></div>
              <button type="button" aria-label="Close book information" disabled={reserving} onClick={() => setSelectedBook(null)} className="rounded-lg p-2 text-[#806F61] hover:bg-[#F1E7DA]"><FaTimes /></button>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-[180px_1fr]">
              <div className="h-64 overflow-hidden rounded-xl bg-[#F1E7DA]">{selectedBook.imageUrl ? <img src={`${API_URL}${selectedBook.imageUrl}`} alt={selectedBook.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><FaBookOpen className="text-[#CDBEAF]" size={56} /></div>}</div>
              <div>
                <h3 className="text-2xl font-bold text-[#2E211A]">{selectedBook.title}</h3>
                <p className="mt-1 text-[#806F61]">Author: {selectedBook.author}</p>
                <dl className="mt-5 space-y-3 border-t border-[#EFE5D8] pt-5 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-[#8A7567]">ISBN</dt><dd className="font-medium">{selectedBook.isbn}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#8A7567]">Category</dt><dd className="text-right font-medium">{selectedBook.categories?.map((category) => category.name).join(", ") || "Uncategorized"}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#8A7567]">Availability</dt><dd className="font-semibold">{selectedBook.availableCopies > 0 ? "Available" : "Unavailable"}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#8A7567]">Copies</dt><dd className="font-medium">{selectedBook.availableCopies} / {selectedBook.totalCopies}</dd></div>
                </dl>
                {message && <p className={`mt-5 rounded-lg p-3 text-sm ${message === "Reservation request submitted successfully." ? "bg-[#E9EFE2] text-[#59683E]" : "bg-[#FCE8E4] text-[#B94A38]"}`}>{message}</p>}
                <button type="button" disabled={reserving || selectedBook.availableCopies === 0 || message === "Reservation request submitted successfully."} onClick={reserveBook} className="mt-5 w-full rounded-xl bg-[#C97B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B96C3D] disabled:cursor-not-allowed disabled:opacity-60">{reserving ? "Submitting request..." : message === "Reservation request submitted successfully." ? "Request Submitted" : selectedBook.availableCopies === 0 ? "Unavailable" : "Request Reservation"}</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

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
            <Link href="/dashboard/member/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6D594C] transition hover:bg-[#E9DDCE]">
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
        <MemberBooksCatalogue />
      </div>
    </div>
  );
}
