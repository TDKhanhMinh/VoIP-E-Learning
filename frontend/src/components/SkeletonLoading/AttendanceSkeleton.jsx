export default function AttendanceSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow bg-white dark:bg-gray-800 animate-pulse">
      <div className="flex justify-between items-center p-4">
        <div className="w-full">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );
}
