export default function AssignmentSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4 animate-pulse bg-white dark:bg-gray-800">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between mt-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );
}
