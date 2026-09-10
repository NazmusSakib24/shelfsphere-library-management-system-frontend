"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";



import {
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTag,
  FiTrash2,
  FiX,
} from "react-icons/fi";



import {
  Category,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categories";




export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);




  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getCategories();



      setCategories(result);
    } catch (error) {
      console.error(error);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };



  const filteredCategories = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return categories;
    }




    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchValue)
    );
  }, [categories, search]);

  const openAddForm = () => {
    setEditingCategory(null);
    setCategoryName("");
    setError("");
    setShowForm(true);
  };


  
  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setError("");
    setShowForm(true);
  };




  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingCategory(null);
    setCategoryName("");
  };



  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = categoryName.trim();



    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }




    try {
      setSaving(true);
      setError("");

      if (editingCategory) {
        const updatedCategory = await updateCategory(
          editingCategory.id,
          trimmedName
        );




        setCategories((previous) =>
          previous.map((category) =>
            category.id === updatedCategory.id
              ? updatedCategory
              : category
          )
        );
      } else {
        const newCategory = await createCategory(
          trimmedName
        );




        setCategories((previous) => [
          ...previous,
          newCategory,
        ]);
      }




      closeForm();
    } catch (error) {
      console.error(error);




      setError(
        editingCategory
          ? "Unable to update the category."
          : "Unable to create the category."
      );
    } finally {
      setSaving(false);
    }
  };




  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );




    if (!confirmed) return;

    try {
      setError("");

      await deleteCategory(id);

      setCategories((previous) =>
        previous.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to delete the category. It may be in use by one or more books."
      );
    }
  };





  return (
    <div className="min-h-screen bg-[#FAF3E9]">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="min-h-screen px-8 pb-10 pt-8">
        <div className="px-8 pb-12">
          <div className="mx-auto max-w-7xl">

            {/* Page Header */}
            <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  

                  <div>
                    <h1 className="text-2xl font-bold text-[#2E211A]">
                      Categories
                    </h1>

                    <p className="mt-1 text-sm text-[#8C7B6B]">
                      Manage your library book categories
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={openAddForm}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C97B4A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B86C3E]"
              >
                <FiPlus className="text-lg" />
                Add Category
              </button>
            </div>

        
            <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="flex items-center gap-3 rounded-xl border border-[#E8DCC8] bg-[#FFF9F2] px-4 py-3">
                <FiSearch className="text-lg text-[#8C7B6B]" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search categories..."
                  className="w-full bg-transparent text-sm text-[#2E211A] outline-none placeholder:text-[#8C7B6B]"
                />
              </div>

              <div className="rounded-xl border border-[#E8DCC8] bg-[#FFF9F2] px-6 py-3">
                <p className="text-xs font-medium text-[#8C7B6B]">
                  Total Categories
                </p>

                <p className="mt-1 text-xl font-bold text-[#2E211A]">
                  {categories.length}
                </p>
              </div>
            </div>

           
            {error && !showForm && (
              <div className="mb-6 rounded-xl border border-[#E8C8C0] bg-[#FCE8E4] px-4 py-3 text-sm text-[#B94A38]">
                {error}
              </div>
            )}

           
            <div className="overflow-hidden rounded-2xl border border-[#E8DCC8] bg-[#FFF9F2] shadow-sm">

           
              <div className="hidden grid-cols-[80px_1fr_160px] border-b border-[#E8DCC8] bg-[#F8EFE5] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8C7B6B] sm:grid">
                <div>ID</div>
                <div>Category Name</div>
                <div className="text-right">
                  Actions
                </div>
              </div>

              {loading ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E8DCC8] border-t-[#C97B4A]" />

                  <p className="mt-4 text-sm text-[#8C7B6B]">
                    Loading categories...
                  </p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E0D5]">
                    <FiTag className="text-2xl text-[#C97B4A]" />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-[#2E211A]">
                    No categories found
                  </h3>

                  <p className="mt-1 text-sm text-[#8C7B6B]">
                    {search
                      ? "Try a different search term."
                      : "Create your first category to get started."}
                  </p>

                  {!search && (
                    <button
                      onClick={openAddForm}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C97B4A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B86C3E]"
                    >
                      <FiPlus />
                      Add Category
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {filteredCategories.map(
                    (category, index) => (
                      <div
                        key={category.id}
                        className={`grid gap-3 px-6 py-5 sm:grid-cols-[80px_1fr_160px] sm:items-center ${
                          index !==
                          filteredCategories.length - 1
                            ? "border-b border-[#E8DCC8]"
                            : ""
                        }`}
                      >
                       
                        <div className="text-sm text-[#8C7B6B]">
                          <span className="sm:hidden">
                            ID:{" "}
                          </span>
                          #{category.id}
                        </div>

                     
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3E0D5]">
                            <FiTag className="text-[#C97B4A]" />
                          </div>

                          <div>
                            <p className="font-semibold text-[#2E211A]">
                              {category.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#8C7B6B]">
                              Book category
                            </p>
                          </div>
                        </div>

                        
                        <div className="flex items-center gap-2 sm:justify-end">
                          <button
                            onClick={() =>
                              openEditForm(category)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B5B4D] transition hover:bg-[#F3EAE0] hover:text-[#C97B4A]"
                            title="Edit category"
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(category.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#B23B2E] transition hover:bg-[#FDECEA]"
                            title="Delete category"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

         


		
            {!loading &&
              filteredCategories.length > 0 && (
                <div className="mt-4 flex items-center justify-between text-xs text-[#8C7B6B]">
                  <p>
                    Showing {filteredCategories.length} of{" "}
                    {categories.length} categories
                  </p>
                </div>
              )}
          </div>
        </div>
      </main>

      

	  
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E8DCC8] bg-[#FFF9F2] shadow-2xl">

           


            <div className="flex items-center justify-between border-b border-[#E8DCC8] px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#2E211A]">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-xs text-[#8C7B6B]">
                  {editingCategory
                    ? "Update the category name"
                    : "Create a new library category"}
                </p>
              </div>

              <button
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8C7B6B] hover:bg-[#F3EAE0]"
              >
                <FiX className="text-lg" />
              </button>
            </div>

          


            <form onSubmit={handleSubmit}>
              <div className="px-6 py-6">

                {error && (
                  <div className="mb-5 rounded-lg bg-[#FCE8E4] px-4 py-3 text-sm text-[#B94A38]">
                    {error}
                  </div>
                )}

                <label className="mb-2 block text-sm font-semibold text-[#4A362A]">
                  Category Name
                </label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(event) =>
                    setCategoryName(event.target.value)
                  }
                  placeholder="e.g. Science Fiction"
                  autoFocus
                  className="w-full rounded-xl border border-[#DCCDBA] bg-white px-4 py-3 text-sm text-[#2E211A] outline-none transition focus:border-[#C97B4A] focus:ring-2 focus:ring-[#C97B4A]/10"
                />
              </div>

             
			 
              <div className="flex justify-end gap-3 border-t border-[#E8DCC8] px-6 py-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#DCCDBA] bg-white px-4 py-2.5 text-sm font-semibold text-[#6B5B4D] hover:bg-[#F8EFE5]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#C97B4A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B86C3E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}