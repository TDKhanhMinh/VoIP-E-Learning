export default function ExamSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 p-4 gap-4 animate-pulse">
      <div className="flex-1 p-6 col-span-1 lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow p-6 rounded border border-gray-100 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>{" "}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>{" "}
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-r p-4 w-full rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-fit">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-5 gap-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
        <div className="mt-6 w-full">
          <div className="h-10 bg-green-200 dark:bg-green-900/30 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
