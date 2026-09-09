"use client";

import { useEffect, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { getBooks } from '@/services/books';
import type { Book } from '@/types/book';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getBooks({ search: search.trim() || undefined, limit: 100 });
        setBooks(result.data);
      } catch {
        setError('Unable to load books from the database.');
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  return (
    <main className="min-h-screen bg-[#FAF3E9] px-6 pb-10 pt-24 text-[#4A362A] lg:ml-[264px] lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7"><h1 className="text-2xl font-bold">Books</h1><p className="mt-1 text-sm text-[#806F61]">Browse the live library catalogue.</p></div>
        <div className="mb-5 rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A08E7F]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or author" className="w-full rounded-lg border border-[#E5D7C7] bg-[#FFFCF7] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#C97B4A]" /></div></div>
        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <div className="overflow-hidden rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9]">
          {loading ? <p className="p-12 text-center text-sm text-[#806F61]">Loading books...</p> : books.length === 0 ? <div className="p-12 text-center"><BookOpen className="mx-auto h-8 w-8 text-[#CDBEAF]" /><p className="mt-3 text-sm text-[#806F61]">No books found.</p></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-[#E8DCC8] text-xs uppercase tracking-wide text-[#806F61]"><tr><th className="px-5 py-4">Book</th><th className="px-5 py-4">ISBN</th><th className="px-5 py-4">Availability</th><th className="px-5 py-4">Categories</th></tr></thead><tbody className="divide-y divide-[#EFE5D8]">{books.map((book) => <tr key={book.id}><td className="px-5 py-4"><p className="font-semibold">{book.title}</p><p className="mt-1 text-xs text-[#806F61]">{book.author}</p></td><td className="px-5 py-4 text-[#806F61]">{book.isbn}</td><td className="px-5 py-4">{book.availableCopies} / {book.totalCopies}</td><td className="px-5 py-4 text-[#806F61]">{book.categories?.map((category) => category.name).join(', ') || 'Uncategorized'}</td></tr>)}</tbody></table></div>}
        </div>
      </div>
    </main>
  );
}
