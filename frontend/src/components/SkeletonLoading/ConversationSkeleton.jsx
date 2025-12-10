export default function ConversationSkeleton() {
  return (
    <div className="p-4 border-b border-gray-100 animate-pulse flex items-start space-x-3">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}
