"use client";

interface FinePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function FinePagination({
  currentPage,
  totalPages,
  onPageChange,
}: FinePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#806F61]">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className="rounded-lg border border-[#D8C9B8] px-4 py-2 text-sm font-medium text-[#4A362A] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1,
        ).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded-lg text-sm font-medium ${
              currentPage === page
                ? "bg-[#C97B4A] text-white"
                : "border border-[#D8C9B8] text-[#4A362A] hover:bg-[#F1E3D2]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className="rounded-lg border border-[#D8C9B8] px-4 py-2 text-sm font-medium text-[#4A362A] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}