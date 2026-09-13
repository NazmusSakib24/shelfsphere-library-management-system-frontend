import { MostBorrowedBook } from "@/services/reports";

interface Props {
  books: MostBorrowedBook[];
}

export default function MostBorrowedBooks({
  books,
}: Props) {
  const maxBorrowCount =
    books.length > 0
      ? Math.max(
          ...books.map((book) => book.borrowCount)
        )
      : 1;

  return (
    <div className="flex flex-col gap-4">
      {books.map((book, index) => {
        const percentage =
          (book.borrowCount / maxBorrowCount) * 100;

        return (
          <div
            key={`${book.title}-${index}`}
            className="flex items-center gap-4"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F3EAE0] text-sm font-semibold text-[#6B5B4D]">
              {index + 1}
            </div>

            <div className="w-48 shrink-0">
              <p className="truncate text-sm font-semibold text-[#2E211A]">
                {book.title}
              </p>
            </div>

            <div className="h-2.5 flex-1 rounded-full bg-[#F3EAE0]">
              <div
                className="h-full rounded-full bg-[#C96F4A]"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <span className="w-20 shrink-0 text-right text-[13px] text-[#6B5B4D]">
              {book.borrowCount} loans
            </span>
          </div>
        );
      })}
    </div>
  );
}