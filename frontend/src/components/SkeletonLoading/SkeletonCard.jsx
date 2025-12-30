export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden animate-pulse">
      <div className="p-6 flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-4"></div>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
