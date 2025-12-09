export default function CalendarSkeleton() {
  return (
    <div className="w-full h-[80vh] bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse flex flex-col">
      <div className="flex border-b border-gray-200">
        <div className="w-16 h-12 bg-gray-50 border-r border-gray-200"></div>
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex-1 h-12 bg-gray-50 border-r border-gray-200 flex items-center justify-center"
          >
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-16 flex flex-col border-r border-gray-200">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-14 border-b border-gray-100 bg-white relative"
            >
              <div className="absolute -top-2 right-2 text-xs text-gray-300">
                --:--
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 flex relative">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-gray-100 h-full bg-white odd:bg-gray-50/30"
            ></div>
          ))}
          <div className="absolute top-14 left-[15%] w-[12%] h-24 bg-blue-100 rounded opacity-50"></div>
          <div className="absolute top-28 left-[43%] w-[12%] h-24 bg-green-100 rounded opacity-50"></div>
          <div className="absolute top-10 left-[71%] w-[12%] h-24 bg-purple-100 rounded opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
