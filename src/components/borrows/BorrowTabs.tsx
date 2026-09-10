"use client";

interface BorrowTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function BorrowTabs({
  activeTab,
  onChange,
}: BorrowTabsProps) {
  const tabs = [
    {
      id: "all",
      label: "All Loans",
    },
    {
      id: "due-soon",
      label: "Due Soon",
    },
    {
      id: "overdue",
      label: "Overdue",
    },
  ];

  return (
    <div className="flex gap-6 border-b border-[#E8DCC8]">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative pb-3 text-sm font-medium transition ${
              active
                ? "text-[#C97B4A]"
                : "text-[#806F61] hover:text-[#4A362A]"
            }`}
          >
            {tab.label}

            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#C97B4A]" />
            )}
          </button>
        );
      })}
    </div>
  );
}