export default function ClassDetailSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto animate-pulse">
      <div className="rounded-xl bg-gray-200 h-40 mb-6 p-8">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[25%_75%] gap-6 p-4">
        <div>
          <div className="border rounded-xl px-4 py-4 shadow-sm h-32 bg-gray-100 mb-4"></div>
          <div className="border rounded-xl px-4 py-4 shadow-sm h-64 bg-gray-100"></div>
        </div>

        <div>
          <div className="h-10 bg-gray-200 rounded-full w-32 mb-6"></div>
          <div className="space-y-4 mb-6">
            <div className="h-24 bg-gray-100 rounded-xl"></div>
            <div className="h-24 bg-gray-100 rounded-xl"></div>
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-100 rounded-xl"></div>
            <div className="h-40 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
