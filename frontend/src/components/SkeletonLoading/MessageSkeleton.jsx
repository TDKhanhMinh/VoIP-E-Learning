export default function MessageSkeleton() {
  return (
    <div className="space-y-6 p-4 animate-pulse">
      <div className="flex justify-start">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl w-1/3"></div>
      </div>
      <div className="flex justify-end">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl w-1/4"></div>
      </div>
      <div className="flex justify-start">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl w-1/2"></div>
      </div>
      <div className="flex justify-end">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-2xl w-1/5"></div>
      </div>
    </div>
  );
}
