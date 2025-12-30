export default function TestCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm animate-pulse flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>

      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mt-auto"></div>
    </div>
  );
}
