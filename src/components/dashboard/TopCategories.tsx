interface Category {
  name: string;
  count: number;
  percentage: number;
}

interface TopCategoriesProps {
  categories: Category[];
}

export default function TopCategories({
  categories,
}: TopCategoriesProps) {
  return (
    <div className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#2E211A]">
          Top Categories
        </h3>

        <p className="mt-1 text-sm text-[#8C7B6B]">
          Most popular book categories
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="py-10 text-center text-sm text-[#8C7B6B]">
          No categories available
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#4A362A]">
                  {category.name}
                </span>

                <span className="text-xs text-[#8C7B6B]">
                  {category.count} books
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#F0E6DA]">
                <div
                  className="h-full rounded-full bg-[#C97B4A]"
                  style={{
                    width: `${Math.min(
                      category.percentage,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}