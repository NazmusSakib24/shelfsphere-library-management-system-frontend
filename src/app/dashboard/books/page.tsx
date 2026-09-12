"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  ChangeEvent, FormEvent, useEffect,
  useMemo,
  useState,
} from "react";


import {
  BookOpen, Grid2X2, List, Pencil, Plus, Search,
  Trash2,  Upload,  X, ChevronDown,
} from "lucide-react";

import {
  createBook, deleteBook, getBooks, updateBook,
  uploadBookImage,
} from "@/services/books";

import {
  Category,
  getCategories,
} from "@/services/categories";

import type { Book } from "@/types/book";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";



interface BooksPageProps {
  memberView?: boolean;
}

export default function BooksPage({
  memberView = false,
}: BooksPageProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);


  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [sortBy, setSortBy] = useState("title");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingBook, setEditingBook] = useState<Book | null>(null);



  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    description: "",
    totalCopies: 1,
    categoryIds: [] as number[],
  });


  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  



  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getBooks({
          search: search.trim() || undefined,
          limit: 100,
        });

        setBooks(result.data);
      } catch (error) {
        console.error(error);

        setError("Unable to load books from the database.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search]);

  



  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories();

        setCategories(result);
      } catch (error) {
        console.error(error);

        setError("Unable to load categories.");
      }
    };

    loadCategories();
  }, []);

  


  const filteredBooks = useMemo(() => {
    let result = [...books];

    
    if (categoryFilter !== "all") {
      const selectedCategoryId = Number(categoryFilter);

      result = result.filter((book) =>
        book.categories?.some(
          (category) => category.id === selectedCategoryId
        )
      );
    }

  
    if (sortBy === "title") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sortBy === "author") {
      result.sort((a, b) =>
        a.author.localeCompare(b.author)
      );
    }

    if (sortBy === "available") {
      result.sort(
        (a, b) =>
          b.availableCopies - a.availableCopies
      );
    }

    if (sortBy === "copies") {
      result.sort(
        (a, b) =>
          b.totalCopies - a.totalCopies
      );
    }

    return result;
  }, [books, categoryFilter, sortBy]);

  
  const openAddForm = () => {
    setEditingBook(null);

    setFormData({
      isbn: "",
      title: "",
      author: "",
      description: "",
      totalCopies: 1,
      categoryIds: [],
    });

    setSelectedImage(null);
    setShowForm(true);
  };

  


  const openEditForm = (book: Book) => {
    setEditingBook(book);

    setFormData({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      description: book.description || "",
      totalCopies: book.totalCopies,
      categoryIds:
        book.categories?.map(
          (category) => category.id
        ) || [],
    });

    setSelectedImage(null);
    setShowForm(true);
  };

  


  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingBook(null);
    setSelectedImage(null);
  };

  



  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "totalCopies"
          ? Number(value)
          : value,
    }));
  };

  


  
  const handleCategoryChange = (categoryId: number) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.categoryIds.includes(categoryId);

      return {
        ...previous,

        categoryIds: alreadySelected
          ? previous.categoryIds.filter(
              (id) => id !== categoryId
            )
          : [
              ...previous.categoryIds,
              categoryId,
            ],
      };
    });
  };

  


  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedImage(file);
    }
  };

 



  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      let savedBook: Book;

      if (editingBook) {
        savedBook = await updateBook(
          editingBook.id,
          formData
        );
      } else {
        savedBook = await createBook(formData);
      }

      



      if (selectedImage) {
        savedBook = await uploadBookImage(
          savedBook.id,
          selectedImage
        );
      }

    



      const result = await getBooks({
        search: search.trim() || undefined,
        limit: 100,
      });

      setBooks(result.data);

      closeForm();
    } catch (error) {
      console.error(error);

      setError(
        editingBook
          ? "Unable to update the book."
          : "Unable to create the book."
      );
    } finally {
      setSaving(false);
    }
  };

  



  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteBook(id);

      setBooks((previous) =>
        previous.filter(
          (book) => book.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      setError("Unable to delete the book.");
    }
  };





  const getAvailability = (book: Book) => {
    if (book.availableCopies === 0) {
      return {
        text: "Unavailable",
        className:
          "bg-[#FCE8E4] text-[#B94A38]",
      };
    }

    if (book.availableCopies <= 2) {
      return {
        text: "Low stock",
        className:
          "bg-[#F7F0DD] text-[#A47A19]",
      };
    }



    return {
      text: "Available",
      className:
        "bg-[#E9EFE2] text-[#687A4A]",
    };
  };





  return (
    <div className="min-h-screen bg-[#FAF3E9]">
      {!memberView && <DashboardSidebar />}
      {!memberView && <DashboardHeader />}

      <main className="min-h-screen px-8 pb-10 pt-8">
        <div className="px-8 pb-12">

          <div className="mx-auto max-w-7xl">

           
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Books
                </h1>

                <p className="mt-1.5 text-sm text-[#8C7B6B]">
                  Manage and browse the library catalogue
                </p>
              </div>

              {!memberView && (
                <button
                  onClick={openAddForm}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#C97B4A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B96C3D]"
                >
                  <Plus className="h-4 w-4" />
                  Add Book
                </button>
              )}

            </div>

           

            <div className="mb-7 rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-5 shadow-sm">

              <div className="flex flex-col gap-4 lg:flex-row">

                
                <div className="relative flex-1">

                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9B8A7A]" />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search books by title or author..."
                    className="w-full rounded-xl border border-[#E8DCC8] bg-[#FAF3E9] py-3 pl-12 pr-4 text-sm text-[#2E211A] outline-none placeholder:text-[#9B8A7A] focus:border-[#C97B4A] focus:ring-2 focus:ring-[#C97B4A]/10"
                  />

                </div>

                


                <div className="relative">

                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-[#E8DCC8] bg-[#FAF3E9] px-4 py-3 pr-10 text-sm text-[#5F4C3D] outline-none focus:border-[#C97B4A] lg:w-48"
                  >
                    <option value="all">
                      All Categories
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C7B6B]" />

                </div>



             
                <div className="relative">

                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-[#E8DCC8] bg-[#FAF3E9] px-4 py-3 pr-10 text-sm text-[#5F4C3D] outline-none focus:border-[#C97B4A] lg:w-48"
                  >
                    <option value="title">
                      Sort: Title
                    </option>

                    <option value="author">
                      Sort: Author
                    </option>

                    <option value="available">
                      Sort: Availability
                    </option>

                    <option value="copies">
                      Sort: Copies
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C7B6B]" />

                </div>

                
                <div className="flex items-center rounded-xl border border-[#E8DCC8] bg-[#FAF3E9] p-1">

                  <button
                    onClick={() =>
                      setViewMode("grid")
                    }
                    className={`rounded-lg p-2.5 transition ${
                      viewMode === "grid"
                        ? "bg-white text-[#C97B4A] shadow-sm"
                        : "text-[#8C7B6B] hover:text-[#C97B4A]"
                    }`}
                    title="Grid view"
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() =>
                      setViewMode("list")
                    }
                    className={`rounded-lg p-2.5 transition ${
                      viewMode === "list"
                        ? "bg-white text-[#C97B4A] shadow-sm"
                        : "text-[#8C7B6B] hover:text-[#C97B4A]"
                    }`}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>

                </div>

              </div>

            </div>

           

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

           
           
            {!loading && books.length > 0 && (
              <div className="mb-4 flex items-center justify-between">

                <p className="text-sm text-[#8C7B6B]">
                  Showing{" "}
                  <span className="font-semibold text-[#5F4C3D]">
                    {filteredBooks.length}
                  </span>{" "}
                  {filteredBooks.length === 1
                    ? "book"
                    : "books"}
                </p>

              </div>
            )}

            



            {loading ? (
              <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-16 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E8DCC8] border-t-[#C97B4A]" />

                <p className="mt-4 text-sm text-[#8C7B6B]">
                  Loading books...
                </p>

              </div>

            ) : filteredBooks.length === 0 ? (

              



              <div className="rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-16 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1E7DA]">

                  <BookOpen className="h-7 w-7 text-[#C97B4A]" />

                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No books found
                </h3>

                <p className="mt-1 text-sm text-[#8C7B6B]">
                  Try changing your search or filter.
                </p>

              </div>

            ) : viewMode === "grid" ? (

              



              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {filteredBooks.map((book) => {
                  const availability =
                    getAvailability(book);

                  return (
                    <div
                      key={book.id}
                      className="group overflow-hidden rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >

                    
                      <div className="relative h-64 overflow-hidden bg-[#F1E7DA]">

                        {book.imageUrl ? (
                          <img
                            src={`${API_URL}${book.imageUrl}`}
                            alt={book.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="h-16 w-16 text-[#CDBEAF]" />
                          </div>
                        )}

                      
                        <span
                          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${availability.className}`}
                        >
                          {availability.text}
                        </span>

                      </div>

                    
                      <div className="p-5">

                        <div className="mb-3">

                          <h3 className="line-clamp-2 text-base font-bold text-[#2E211A]">
                            {book.title}
                          </h3>

                          <p className="mt-1 text-sm text-[#8C7B6B]">
                            {book.author}
                          </p>

                        </div>

                       
                        <div className="mb-4 flex min-h-6 flex-wrap gap-1.5">

                          {book.categories &&
                          book.categories.length > 0 ? (
                            book.categories
                              .slice(0, 2)
                              .map((category) => (
                                <span
                                  key={category.id}
                                  className="rounded-full bg-[#F1E7DA] px-2.5 py-1 text-[11px] font-medium text-[#735D4D]"
                                >
                                  {category.name}
                                </span>
                              ))
                          ) : (
                            <span className="text-xs text-[#A08E7F]">
                              Uncategorized
                            </span>
                          )}

                        </div>



                       
                        <div className="flex items-center justify-between border-t border-[#EFE5D8] pt-4">

                          <div>
                            <p className="text-xs text-[#9B8A7A]">
                              Available
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-[#4A362A]">
                              {book.availableCopies} /{" "}
                              {book.totalCopies} copies
                            </p>
                          </div>

                         


                          {!memberView && (
                          <div className="flex gap-1">

                            <button
                              onClick={() =>
                                openEditForm(book)
                              }
                              className="rounded-lg p-2 text-[#8C7B6B] transition hover:bg-[#F1E7DA] hover:text-[#C97B4A]"
                              title="Edit book"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(book.id)
                              }
                              className="rounded-lg p-2 text-[#8C7B6B] transition hover:bg-red-50 hover:text-red-600"
                              title="Delete book"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            ) : (

             



              <div className="overflow-hidden rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9]">

                <div className="overflow-x-auto">

                  <table className="w-full text-left text-sm">

                    <thead className="border-b border-[#E8DCC8] bg-[#FAF3E9] text-xs uppercase tracking-wide text-[#806F61]">

                      <tr>
                        <th className="px-5 py-4">
                          Book
                        </th>

                        <th className="px-5 py-4">
                          ISBN
                        </th>

                        <th className="px-5 py-4">
                          Availability
                        </th>

                        <th className="px-5 py-4">
                          Categories
                        </th>

                        {!memberView && (
                          <th className="px-5 py-4 text-right">
                            Actions
                          </th>
                        )}
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-[#EFE5D8]">

                      {filteredBooks.map((book) => {
                        const availability =
                          getAvailability(book);

                        return (
                          <tr
                            key={book.id}
                            className="transition hover:bg-[#FAF3E9]"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                {book.imageUrl ? (
                                  <img
                                    src={`${API_URL}${book.imageUrl}`}
                                    alt={book.title}
                                    className="h-16 w-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-[#F1E7DA]">
                                    <BookOpen className="h-5 w-5 text-[#A08E7F]" />
                                  </div>
                                )}

                                <div>

                                  <p className="font-semibold text-[#2E211A]">
                                    {book.title}
                                  </p>

                                  <p className="mt-1 text-xs text-[#806F61]">
                                    {book.author}
                                  </p>

                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4 text-[#806F61]">
                              {book.isbn}
                            </td>

                            <td className="px-5 py-4">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${availability.className}`}
                              >
                                {book.availableCopies} /{" "}
                                {book.totalCopies}
                              </span>

                            </td>

                            <td className="px-5 py-4 text-[#806F61]">

                              {book.categories
                                ?.map(
                                  (category) =>
                                    category.name
                                )
                                .join(", ") ||
                                "Uncategorized"}

                            </td>

                            {!memberView && (
                            <td className="px-5 py-4">

                              <div className="flex justify-end gap-1">

                                <button
                                  onClick={() =>
                                    openEditForm(book)
                                  }
                                  className="rounded-lg p-2 text-[#806F61] hover:bg-[#F1E7DA] hover:text-[#C97B4A]"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(book.id)
                                  }
                                  className="rounded-lg p-2 text-[#806F61] hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                              </div>

                            </td>
                            )}

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>

              </div>
            )}

            



            {!loading &&
              filteredBooks.length > 0 && (
                <div className="mt-6 flex items-center justify-between border-t border-[#E8DCC8] pt-5">

                  <p className="text-xs text-[#9B8A7A]">
                    {filteredBooks.length} books in catalogue
                  </p>

                  <p className="text-xs text-[#9B8A7A]">
                    ShelfSphere Library
                  </p>

                </div>
              )}

          </div>

          


          {!memberView && showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">

              <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] shadow-2xl">

               

                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EFE5D8] bg-[#FFFDF9] px-6 py-5">

                  <div>

                    <h2 className="text-xl font-bold text-[#2E211A]">
                      {editingBook
                        ? "Edit Book"
                        : "Add Book"}
                    </h2>

                    <p className="mt-1 text-sm text-[#8C7B6B]">
                      {editingBook
                        ? "Update the book information below."
                        : "Add a new book to the library catalogue."}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-lg p-2 text-[#806F61] transition hover:bg-[#F1E7DA] hover:text-[#4A362A]"
                  >
                    <X className="h-5 w-5" />
                  </button>

                </div>

                
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 p-6"
                >

                  {/* Title + Author */}
                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                        Book Title
                      </label>

                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter book title"
                        className="w-full rounded-xl border border-[#E5D7C7] bg-[#FAF3E9] px-4 py-3 text-sm outline-none transition focus:border-[#C97B4A] focus:ring-2 focus:ring-[#C97B4A]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                        Author
                      </label>

                      <input
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter author name"
                        className="w-full rounded-xl border border-[#E5D7C7] bg-[#FAF3E9] px-4 py-3 text-sm outline-none transition focus:border-[#C97B4A] focus:ring-2 focus:ring-[#C97B4A]/10"
                      />
                    </div>

                  </div>

                  
                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                        ISBN
                      </label>

                      <input
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter ISBN"
                        className="w-full rounded-xl border border-[#E5D7C7] bg-[#FAF3E9] px-4 py-3 text-sm outline-none transition focus:border-[#C97B4A] focus:ring-2 focus:ring-[#C97B4A]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                        Total Copies
                      </label>

                      <input
                        name="totalCopies"
                        type="number"
                        min="1"
                        value={formData.totalCopies}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-[#E5D7C7] bg-[#FAF3E9] px-4 py-3 text-sm outline-none transition focus:border-[#C97B4A] focus:ring-2 focus:ring-[#C97B4A]/10"
                      />
                    </div>

                  </div>

                  
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Write a short description about the book..."
                      className="w-full resize-none rounded-xl border border-[#E5D7C7] bg-[#FAF3E9] px-4 py-3 text-sm outline-none transition focus:border-[#C97B4A] focus:ring-2 focus:ring-[#C97B4A]/10"
                    />

                  </div>

                
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                      Categories
                    </label>

                    {categories.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#E5D7C7] bg-[#FAF3E9] p-4 text-sm text-[#8C7B6B]">
                        No categories available.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                        {categories.map((category) => {
                          const selected =
                            formData.categoryIds.includes(
                              category.id
                            );

                          return (
                            <label
                              key={category.id}
                              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                                selected
                                  ? "border-[#C97B4A] bg-[#F7E8DC] text-[#8C4F2F]"
                                  : "border-[#E5D7C7] bg-[#FAF3E9] text-[#6B594C] hover:border-[#C97B4A]"
                              }`}
                            >

                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() =>
                                  handleCategoryChange(
                                    category.id
                                  )
                                }
                                className="accent-[#C97B4A]"
                              />

                              <span>
                                {category.name}
                              </span>

                            </label>
                          );
                        })}

                      </div>
                    )}

                  </div>

                  
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                      Book Cover
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C7B4] bg-[#FAF3E9] px-5 py-7 text-center transition hover:border-[#C97B4A] hover:bg-[#F7E8DC]">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1E7DA]">
                        <Upload className="h-5 w-5 text-[#C97B4A]" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-[#5F4C3D]">
                        {selectedImage
                          ? selectedImage.name
                          : "Choose book cover image"}
                      </p>

                      <p className="mt-1 text-xs text-[#9B8A7A]">
                        PNG, JPG or JPEG
                      </p>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                    </label>

                    {editingBook &&
                      editingBook.imageUrl &&
                      !selectedImage && (
                        <p className="mt-2 text-xs text-[#8C7B6B]">
                          The current cover will remain
                          unchanged unless you choose a
                          new image.
                        </p>
                      )}

                  </div>

                 
                  <div className="flex justify-end gap-3 border-t border-[#EFE5D8] pt-5">

                    <button
                      type="button"
                      onClick={closeForm}
                      disabled={saving}
                      className="rounded-xl border border-[#E5D7C7] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B594C] transition hover:bg-[#F1E7DA] disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-[#C97B4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B96C3D] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          {editingBook
                            ? "Update Book"
                            : "Add Book"}
                        </>
                      )}
                    </button>

                  </div>

                </form>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
