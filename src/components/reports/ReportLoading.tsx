export default function ReportLoading() {
  return (
    <div className="min-h-screen bg-[#FAF3E9] p-7">
      <div className="animate-pulse space-y-6">

        <div className="h-8 w-32 rounded bg-[#E8DCC8]" />

        <div className="grid grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-xl bg-white"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="h-80 rounded-xl bg-white" />
          <div className="h-80 rounded-xl bg-white" />
        </div>

      </div>
    </div>
  );
}