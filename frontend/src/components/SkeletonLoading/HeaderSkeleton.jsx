export default function HeaderSkeleton() {
  return (
    <div className="flex justify-between items-center animate-pulse">
      <div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  );
}
