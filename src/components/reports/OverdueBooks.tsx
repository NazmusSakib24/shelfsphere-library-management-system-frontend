import { OverdueBook } from "@/services/reports";

interface Props {
  books: OverdueBook[];
}

export default function OverdueBooks({
  books,
}: Props) {
  if (books.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#D8C9B8] p-8 text-center">
        <p className="text-sm text-[#8C7B6B]">
          No overdue books.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E8DCC8] text-left text-xs text-[#8C7B6B]">
            <th className="px-3 py-3">Book</th>
            <th className="px-3 py-3">Member</th>
            <th className="px-3 py-3">Borrowed</th>
            <th className="px-3 py-3">Due Date</th>
          </tr>
        </thead>

        <tbody>
          {books.map((record) => (
            <tr
              key={record.id}
              className="border-b border-[#F1E7DA]"
            >
              <td className="px-3 py-3 text-sm font-medium">
                {record.book?.title ?? "Unknown Book"}
              </td>

              <td className="px-3 py-3 text-sm">
                {record.member?.fullName ??
                  "Unknown Member"}
              </td>

              <td className="px-3 py-3 text-sm text-[#6B5B4D]">
                {formatDate(record.borrowedAt)}
              </td>

              <td className="px-3 py-3 text-sm font-medium text-[#C96F4A]">
                {formatDate(record.dueDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}