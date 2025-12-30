export default function TopicSidebarSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse h-fit">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"
          ></div>
        ))}
      </div>
    </div>
  );
}
